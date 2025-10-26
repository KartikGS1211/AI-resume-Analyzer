import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Eye, Calendar, TrendingUp } from 'lucide-react';
import { mockResumeHistory } from '../lib/mockData';
import type { ResumeAnalysis } from '../App';

interface HistoryProps {
  onViewFeedback: (analysis: ResumeAnalysis) => void;
}

export function History({ onViewFeedback }: HistoryProps) {
  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8 w-full">
      <div>
        <h1>Analysis History</h1>
        <p className="text-muted-foreground mt-2">
          View all your past resume analyses and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Analyses</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{mockResumeHistory.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time submissions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Highest Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {Math.max(...mockResumeHistory.map((r) => r.score))}/100
              </div>
              <Progress
                value={Math.max(...mockResumeHistory.map((r) => r.score))}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sm:col-span-2 lg:col-span-1"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">
                {Math.round(
                  mockResumeHistory.reduce((sum, r) => sum + r.score, 0) /
                    mockResumeHistory.length
                )}
                /100
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep improving!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Resume Submissions</CardTitle>
            <CardDescription>
              Complete history of your resume analyses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Job Role</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Missing Skills</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResumeHistory.map((resume, index) => (
                    <motion.tr
                      key={resume.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="group"
                    >
                      <TableCell className="max-w-[200px] truncate">{resume.fileName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {resume.uploadDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{resume.jobRole}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getScoreBadge(resume.score)}>
                          {resume.score}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-destructive">
                          {resume.missingSkills.length} skills
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewFeedback(resume)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {mockResumeHistory.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div>
                    <p className="truncate">{resume.fileName}</p>
                    <p className="text-sm text-muted-foreground">{resume.uploadDate}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{resume.jobRole}</Badge>
                    <Badge variant={getScoreBadge(resume.score)}>
                      {resume.score}/100
                    </Badge>
                    <span className="text-sm text-destructive">
                      {resume.missingSkills.length} skills missing
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onViewFeedback(resume)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
