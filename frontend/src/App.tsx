import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { UploadResume } from './components/UploadResume';
import { Feedback } from './components/Feedback';
import { History } from './components/History';
import { AdminDashboard } from './components/AdminDashboard';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { Menu, X } from 'lucide-react';
import JobRecommendations from './components/JobRecommendations';

export type Page = 'dashboard' | 'upload' | 'feedback' | 'history' | 'admin' | 'jobs';

export interface ResumeAnalysis {
  id: string;
  fileName: string;
  uploadDate: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  jobRole: string;
  extractedText: string;
  keyInsights: {
    actionVerbs: number;
    quantifiableAchievements: number;
    educationFound: boolean;
    experienceYears: number;
  };
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResumeAnalysis | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleViewFeedback = (analysis: ResumeAnalysis) => {
    setSelectedAnalysis(analysis);
    setCurrentPage('feedback');
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigateToUpload={() => handleNavigate('upload')} />;
      case 'upload':
        return <UploadResume onAnalysisComplete={handleViewFeedback} />;
      case 'feedback':
        return <Feedback analysis={selectedAnalysis} />;
      case 'history':
        return <History onViewFeedback={handleViewFeedback} />;
      case 'admin':
        return <AdminDashboard />;
      case 'jobs' :
        return <JobRecommendations />;
      default:
        return <Dashboard onNavigateToUpload={() => handleNavigate('upload')} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Header with sidebar toggle */}
          <div className="sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="flex-shrink-0"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center justify-between flex-1">
              <h2 className="text-sm sm:text-base">Resume Analyzer</h2>
              <div className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                AI-Powered Insights
              </div>
            </div>
          </div>
          
          {renderPage()}
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;