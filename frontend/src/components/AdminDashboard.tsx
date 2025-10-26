import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit, Trash2, Users, Briefcase, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { mockJobRoles, mockResumeHistory } from '../lib/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function AdminDashboard() {
  const [jobRoles, setJobRoles] = useState(mockJobRoles);
  const [newRole, setNewRole] = useState({ title: '', keywords: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddRole = () => {
    if (!newRole.title || !newRole.keywords) {
      toast.error('Please fill in all fields');
      return;
    }

    const role = {
      id: `role-${Date.now()}`,
      title: newRole.title,
      keywords: newRole.keywords.split(',').map((k: string) => k.trim()),
    };

    setJobRoles([...jobRoles, role]);
    setNewRole({ title: '', keywords: '' });
    setDialogOpen(false);
    toast.success('Job role added successfully!');
  };

  const handleDeleteRole = (id: string) => {
    setJobRoles(jobRoles.filter((role) => role.id !== id));
    toast.success('Job role deleted');
  };

  // Analytics data
  const skillGapData = [
    { skill: 'Python', count: 8 },
    { skill: 'React', count: 6 },
    { skill: 'AWS', count: 5 },
    { skill: 'Docker', count: 5 },
    { skill: 'TypeScript', count: 4 },
    { skill: 'Node.js', count: 3 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8 w-full">
      <div>
        <h1>Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage job roles, keywords, and view analytics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">156</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12 this month
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
              <CardTitle className="text-sm">Job Roles</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{jobRoles.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active job descriptions
              </p>
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
              <CardTitle className="text-sm">Total Analyses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{mockResumeHistory.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time submissions
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Job Roles</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Job Roles & Keywords</CardTitle>
                  <CardDescription>
                    Manage job descriptions and associated skill keywords
                  </CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Job Role</DialogTitle>
                      <DialogDescription>
                        Create a new job role with associated keywords
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Senior Frontend Developer"
                          value={newRole.title}
                          onChange={(e) =>
                            setNewRole({ ...newRole, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                        <Textarea
                          id="keywords"
                          placeholder="e.g., React, TypeScript, CSS, Node.js"
                          value={newRole.keywords}
                          onChange={(e) =>
                            setNewRole({ ...newRole, keywords: e.target.value })
                          }
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                      <Button onClick={handleAddRole} className="w-full sm:w-auto">Add Role</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Keywords</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobRoles.map((role, index) => (
                      <motion.tr
                        key={role.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TableCell>{role.title}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.keywords.slice(0, 5).map((keyword) => (
                              <Badge key={keyword} variant="secondary">
                                {keyword}
                              </Badge>
                            ))}
                            {role.keywords.length > 5 && (
                              <Badge variant="outline">
                                +{role.keywords.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {jobRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="pr-4">{role.title}</h3>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.keywords.slice(0, 5).map((keyword) => (
                        <Badge key={keyword} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                      {role.keywords.length > 5 && (
                        <Badge variant="outline">
                          +{role.keywords.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Common Skill Gaps</CardTitle>
              <CardDescription>
                Skills most frequently missing across all analyzed resumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillGapData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" className="text-xs" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest resume analyses across all users</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Job Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockResumeHistory.slice(0, 5).map((resume) => (
                      <TableRow key={resume.id}>
                        <TableCell className="max-w-[200px] truncate">{resume.fileName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {resume.uploadDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              resume.score >= 80
                                ? 'default'
                                : resume.score >= 60
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {resume.score}/100
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{resume.jobRole}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {mockResumeHistory.slice(0, 5).map((resume) => (
                  <div key={resume.id} className="border rounded-lg p-3 space-y-2">
                    <p className="text-sm truncate">{resume.fileName}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-muted-foreground">{resume.uploadDate}</span>
                      <Badge
                        variant={
                          resume.score >= 80
                            ? 'default'
                            : resume.score >= 60
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {resume.score}/100
                      </Badge>
                      <Badge variant="outline">{resume.jobRole}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
