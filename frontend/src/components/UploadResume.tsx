import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Upload,
  FileText,
  Loader2,
  Sparkles,
  ClipboardList,
  BarChart3,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

interface ResumeAnalysis {
  ats_score: number | null;
  feedback: string;
  analysis: string;
}

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'complete';

export function UploadResume() {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);

  const mdParser = new MarkdownIt();

  // 🔹 Render Markdown safely as HTML
  const renderMarkdownToHTML = (markdown: string) => {
    const html = mdParser.render(markdown || '');
    return { __html: DOMPurify.sanitize(html) };
  };

  // 🔹 Handle drag & drop events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        handleFileUpload(file);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        handleFileUpload(file);
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  // 🔹 Upload and analyze resume
  const handleFileUpload = async (file: File) => {
    setUploadState('uploading');
    setProgress(0);

    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise((resolve) => setTimeout(resolve, 2200));
    setUploadState('analyzing');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Failed to analyze resume');
        setUploadState('idle');
        return;
      }

      const data = await res.json();
      setUploadState('complete');
      setResult(data);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Server error. Please try again.');
      setUploadState('idle');
    }
  };

  const resetAll = () => {
    setUploadState('idle');
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
  };

  // 🔹 Render markdown into PDF (bold, italic, lists)
  const renderMarkdownToPDF = (doc: jsPDF, markdown: string, startY: number) => {
    const tokens = mdParser.parse(markdown, {});
    let y = startY;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height - 20;

    tokens.forEach((token, i) => {
      if (token.type === 'paragraph_open') return;

      // bullet list
      if (token.type === 'list_item_open') {
        const next = tokens[i + 1];
        if (next && next.type === 'inline') {
          doc.text(`• ${next.content}`, 14, y);
          y += lineHeight;
        }
        return;
      }

      // inline markdown
      if (token.type === 'inline') {
        let currentX = 14;
        let isBold = false;
        let isItalic = false;

        token.children?.forEach((child) => {
          if (child.type === 'strong_open') {
            isBold = true;
            doc.setFont('helvetica', 'bold');
          }
          if (child.type === 'em_open') {
            isItalic = true;
            doc.setFont('helvetica', 'italic');
          }
          if (child.type === 'code_inline') {
            doc.setFont('courier', 'normal');
            doc.text(child.content, currentX, y);
            currentX += doc.getTextWidth(child.content) + 2;
            doc.setFont('helvetica', isBold ? 'bold' : isItalic ? 'italic' : 'normal');
          }
          if (child.type === 'text') {
            doc.text(child.content, currentX, y);
            currentX += doc.getTextWidth(child.content) + 1;
          }
          if (child.type === 'strong_close') {
            isBold = false;
            doc.setFont('helvetica', isItalic ? 'italic' : 'normal');
          }
          if (child.type === 'em_close') {
            isItalic = false;
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
          }
        });

        y += lineHeight;
      }

      if (token.type === 'paragraph_close') {
        y += 3;
      }

      // Page break
      if (y > pageHeight) {
        doc.addPage();
        y = 20;
      }
    });

    return y;
  };

  // 🔹 Export PDF with markdown rendering
  // const exportPDF = () => {
  //   if (!result) return;

  //   const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  //   doc.setFont('helvetica', 'bold');
  //   doc.setFontSize(18);
  //   doc.text('Resume Analysis Report', 14, 20);

  //   doc.setFont('helvetica', 'normal');
  //   doc.setFontSize(12);
  //   doc.text(`ATS Score: ${result.ats_score ?? 'N/A'}%`, 14, 30);

  //   let currentY = 40;
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Feedback', 14, currentY);
  //   doc.setFont('helvetica', 'normal');
  //   currentY += 8;
  //   currentY = renderMarkdownToPDF(doc, result.feedback || 'No feedback provided.', currentY);

  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Detailed Analysis', 14, currentY + 5);
  //   doc.setFont('helvetica', 'normal');
  //   currentY += 13;
  //   renderMarkdownToPDF(doc, result.analysis || 'No analysis available.', currentY);

  //   doc.save('resume_analysis_report.pdf');
  //   toast.success('PDF exported successfully!');
  // };

  const exportPDF = () => {
  if (!result) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Resume Analysis Report', 14, 20);

  // ATS Score
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`ATS Score: ${result.ats_score ?? 'N/A'}%`, 14, 30);

  // Table Data
  const tableData = [
    [
      {
        content: 'Feedback',
        styles: { fontStyle: 'bold', valign: 'middle', halign: 'center' },
      },
      {
        content: result.feedback || 'No feedback provided.',
        styles: { halign: 'left' },
      },
    ],
    [
      {
        content: 'Detailed Analysis',
        styles: { fontStyle: 'bold', valign: 'middle', halign: 'center' },
      },
      {
        content: result.analysis || 'No analysis available.',
        styles: { halign: 'left' },
      },
    ],
  ];

  // Create table
  autoTable(doc, {
    head: [['Section', 'Details']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 5,
      valign: 'top',
    },
    headStyles: {
      fillColor: [0, 102, 204], // Blue header
      textColor: [255, 255, 255],
      halign: 'center',
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 140 },
    },
  });

  // Save
  doc.save('resume_analysis_report.pdf');
  toast.success('PDF exported successfully!');
};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 lg:space-y-8 w-full">
      {!result ? (
        <>
          <div>
            <h1 className="text-2xl font-bold">Upload Resume</h1>
            <p className="text-muted-foreground mt-2">
              Upload your resume in PDF format for AI-powered ATS analysis
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resume Upload</CardTitle>
              <CardDescription>
                Drag and drop your PDF resume or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                whileHover={{ scale: uploadState === 'idle' ? 1.01 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadState !== 'idle'}
                />
                <div className="flex flex-col items-center justify-center space-y-4">
                  {uploadState === 'idle' && (
                    <>
                      <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm sm:text-base">
                          Drag and drop your resume here, or click to browse
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          PDF files only (Max 10MB)
                        </p>
                      </div>
                      <Button variant="outline">Browse Files</Button>
                    </>
                  )}

                  {uploadState === 'uploading' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-4">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-spin" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm sm:text-base">
                          <span>Uploading...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                      {selectedFile && (
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground break-all px-4">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{selectedFile.name}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {uploadState === 'analyzing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-4 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base">Analyzing your resume...</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          This may take a few moments
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
          <h1 className="text-2xl font-bold text-center mb-6">AI Resume Analysis Result</h1>

          <Card>
            <CardHeader className="text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-primary mb-2" />
              <CardTitle>ATS Score</CardTitle>
              <CardDescription>Your resume’s compatibility with job systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={result.ats_score || 0} />
              <p className="text-center text-lg font-semibold">
                {result.ats_score ? `${result.ats_score}%` : 'N/A'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ClipboardList className="h-6 w-6 text-primary mb-1" />
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm sm:prose-base text-muted-foreground max-w-none"
                dangerouslySetInnerHTML={renderMarkdownToHTML(result.feedback)}
              ></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-6 w-6 text-primary mb-1" />
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm sm:prose-base text-muted-foreground max-w-none"
                dangerouslySetInnerHTML={renderMarkdownToHTML(result.analysis)}
              ></div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={resetAll} variant="outline">Upload Another Resume</Button>
            <Button onClick={exportPDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
