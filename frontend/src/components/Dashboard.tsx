import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Upload, FileCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { mockResumeHistory } from '../lib/mockData';

interface DashboardProps {
  onNavigateToUpload: () => void;
}

export function Dashboard({ onNavigateToUpload }: DashboardProps) {
  const totalResumes = mockResumeHistory.length;
  const avgScore = Math.round(
    mockResumeHistory.reduce((sum, r) => sum + r.score, 0) / totalResumes
  );
  const latestResume = mockResumeHistory[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full">
      <div>
        <h1>Welcome Back!</h1>
        <p className="text-muted-foreground mt-2">
          Analyze your resume and get AI-powered feedback to land your dream job.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Resumes</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalResumes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{avgScore}/100</div>
            <Progress value={avgScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Skill Gaps</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {latestResume?.missingSkills.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From latest analysis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started by uploading your resume for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onNavigateToUpload} size="lg" className="w-full sm:w-auto">
            <Upload className="mr-2 h-5 w-5" />
            Upload New Resume
          </Button>
        </CardContent>
      </Card>

      {/* Latest Analysis */}
      {latestResume && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Analysis</CardTitle>
            <CardDescription className="break-words">
              {latestResume.fileName} - {latestResume.uploadDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Resume Score</span>
                <span>{latestResume.score}/100</span>
              </div>
              <Progress value={latestResume.score} />
            </div>
            <div>
              <p className="text-sm mb-2">Top Missing Skills:</p>
              <div className="flex flex-wrap gap-2">
                {latestResume.missingSkills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}