import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import type { ResumeAnalysis } from '../App';

interface FeedbackProps {
  analysis: ResumeAnalysis | null;
}

export function Feedback({ analysis }: FeedbackProps) {
  if (!analysis) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No resume analysis available. Please upload a resume first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const radarData = [
    { skill: 'Technical Skills', value: analysis.matchedSkills.length * 10 },
    { skill: 'Experience', value: analysis.keyInsights.experienceYears * 10 },
    { skill: 'Education', value: analysis.keyInsights.educationFound ? 100 : 50 },
    { skill: 'Action Verbs', value: analysis.keyInsights.actionVerbs * 10 },
    { skill: 'Achievements', value: analysis.keyInsights.quantifiableAchievements * 10 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 lg:space-y-8 w-full">
      <div>
        <h1>Resume Feedback</h1>
        <p className="text-muted-foreground mt-2 break-words">
          Detailed analysis for {analysis.fileName}
        </p>
      </div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Resume Score</CardTitle>
            <CardDescription>Overall assessment of your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className={`text-5xl sm:text-6xl ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </div>
                <p className="text-muted-foreground mt-1">out of 100</p>
              </div>
              <div className="w-full sm:w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" className="text-xs" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <Progress value={analysis.score} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills Analysis</TabsTrigger>
          <TabsTrigger value="suggestions" className="text-xs sm:text-sm">Suggestions</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          {/* Matched Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <CardTitle>Matched Skills</CardTitle>
                </div>
                <CardDescription>
                  Skills found in your resume that match the {analysis.jobRole} role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedSkills.map((skill) => (
                    <Badge key={skill} variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Missing Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <CardTitle>Missing Skills</CardTitle>
                </div>
                <CardDescription>
                  Important skills for {analysis.jobRole} that are missing from your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill) => (
                    <Badge key={skill} variant="destructive">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <CardTitle>AI-Powered Suggestions</CardTitle>
                </div>
                <CardDescription>
                  Actionable recommendations to improve your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-3 p-3 sm:p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm sm:text-base">{suggestion}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Action Verbs</CardTitle>
                  <CardDescription>Strong action verbs used in your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl">{analysis.keyInsights.actionVerbs}</div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Great! Action verbs make your resume more impactful
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quantifiable Achievements</CardTitle>
                  <CardDescription>Measurable accomplishments found</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl">{analysis.keyInsights.quantifiableAchievements}</div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Numbers and metrics strengthen your impact
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                  <CardDescription>Years of experience detected</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl">{analysis.keyInsights.experienceYears}</div>
                    <span className="text-muted-foreground">years</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on your work history
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Educational background status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {analysis.keyInsights.educationFound ? (
                      <>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <span className="text-xl">Found</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-8 w-8 text-red-500" />
                        <span className="text-xl">Missing</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {analysis.keyInsights.educationFound
                      ? 'Education section is present'
                      : 'Consider adding education details'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}