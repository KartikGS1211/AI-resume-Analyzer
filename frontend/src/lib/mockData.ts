import type { ResumeAnalysis } from '../App';

export const mockJobRoles = [
  {
    id: 'role-1',
    title: 'Full Stack Developer',
    keywords: [
      'JavaScript',
      'React',
      'Node.js',
      'TypeScript',
      'MongoDB',
      'Express',
      'REST API',
      'Git',
      'AWS',
      'Docker',
    ],
  },
  {
    id: 'role-2',
    title: 'Data Scientist',
    keywords: [
      'Python',
      'Machine Learning',
      'TensorFlow',
      'Pandas',
      'NumPy',
      'SQL',
      'Data Visualization',
      'Statistics',
      'Scikit-learn',
      'Deep Learning',
    ],
  },
  {
    id: 'role-3',
    title: 'DevOps Engineer',
    keywords: [
      'Docker',
      'Kubernetes',
      'AWS',
      'CI/CD',
      'Jenkins',
      'Terraform',
      'Linux',
      'Python',
      'Bash',
      'Monitoring',
    ],
  },
  {
    id: 'role-4',
    title: 'UI/UX Designer',
    keywords: [
      'Figma',
      'Adobe XD',
      'Sketch',
      'Prototyping',
      'User Research',
      'Wireframing',
      'Design Systems',
      'HTML/CSS',
      'Responsive Design',
      'Accessibility',
    ],
  },
];

export const mockResumeHistory: ResumeAnalysis[] = [
  {
    id: 'resume-1',
    fileName: 'john_doe_resume_v3.pdf',
    uploadDate: '2025-10-20',
    score: 85,
    matchedSkills: [
      'JavaScript',
      'React',
      'Node.js',
      'TypeScript',
      'Git',
      'REST API',
    ],
    missingSkills: ['AWS', 'Docker', 'MongoDB', 'Express'],
    suggestions: [
      'Add more quantifiable achievements with specific metrics (e.g., "Improved performance by 40%")',
      'Include cloud technologies like AWS or Azure to match modern job requirements',
      'Use stronger action verbs at the beginning of bullet points (e.g., "Architected", "Spearheaded")',
      'Add a brief summary section at the top highlighting your key strengths',
      'Consider adding relevant certifications or online courses completed',
    ],
    jobRole: 'Full Stack Developer',
    extractedText: 'Sample extracted text from resume...',
    keyInsights: {
      actionVerbs: 8,
      quantifiableAchievements: 5,
      educationFound: true,
      experienceYears: 5,
    },
  },
  {
    id: 'resume-2',
    fileName: 'john_doe_resume_v2.pdf',
    uploadDate: '2025-09-15',
    score: 72,
    matchedSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    missingSkills: [
      'TypeScript',
      'Node.js',
      'AWS',
      'Docker',
      'MongoDB',
      'Express',
      'REST API',
    ],
    suggestions: [
      'Expand your technical skills section to include backend technologies',
      'Add more detail about your role and responsibilities in each position',
      'Include links to your portfolio or GitHub projects',
      'Highlight leadership experience and team collaboration',
      'Improve formatting consistency throughout the document',
    ],
    jobRole: 'Full Stack Developer',
    extractedText: 'Sample extracted text from resume...',
    keyInsights: {
      actionVerbs: 6,
      quantifiableAchievements: 3,
      educationFound: true,
      experienceYears: 4,
    },
  },
  {
    id: 'resume-3',
    fileName: 'jane_smith_data_scientist.pdf',
    uploadDate: '2025-10-18',
    score: 91,
    matchedSkills: [
      'Python',
      'Machine Learning',
      'TensorFlow',
      'Pandas',
      'NumPy',
      'SQL',
      'Statistics',
      'Scikit-learn',
    ],
    missingSkills: ['Deep Learning', 'Data Visualization'],
    suggestions: [
      'Excellent resume! Consider adding visualization tools like Tableau or PowerBI',
      'Include links to published research papers or projects',
      'Add specific examples of business impact from your ML models',
    ],
    jobRole: 'Data Scientist',
    extractedText: 'Sample extracted text from resume...',
    keyInsights: {
      actionVerbs: 12,
      quantifiableAchievements: 8,
      educationFound: true,
      experienceYears: 6,
    },
  },
  {
    id: 'resume-4',
    fileName: 'mike_johnson_devops.pdf',
    uploadDate: '2025-10-10',
    score: 78,
    matchedSkills: [
      'Docker',
      'Kubernetes',
      'AWS',
      'Linux',
      'Python',
      'Jenkins',
    ],
    missingSkills: ['Terraform', 'CI/CD', 'Bash', 'Monitoring'],
    suggestions: [
      'Add experience with Infrastructure as Code tools like Terraform',
      'Highlight your monitoring and observability expertise',
      'Include security-related skills and certifications',
      'Add more details about automation projects you\'ve implemented',
    ],
    jobRole: 'DevOps Engineer',
    extractedText: 'Sample extracted text from resume...',
    keyInsights: {
      actionVerbs: 9,
      quantifiableAchievements: 6,
      educationFound: true,
      experienceYears: 4,
    },
  },
  {
    id: 'resume-5',
    fileName: 'sarah_designer_portfolio.pdf',
    uploadDate: '2025-10-05',
    score: 88,
    matchedSkills: [
      'Figma',
      'Adobe XD',
      'Prototyping',
      'User Research',
      'Wireframing',
      'Design Systems',
      'Responsive Design',
    ],
    missingSkills: ['Sketch', 'HTML/CSS', 'Accessibility'],
    suggestions: [
      'Consider adding basic HTML/CSS knowledge for developer handoff',
      'Highlight accessibility standards and WCAG compliance experience',
      'Include case studies demonstrating your design process',
      'Add metrics showing the impact of your design improvements',
    ],
    jobRole: 'UI/UX Designer',
    extractedText: 'Sample extracted text from resume...',
    keyInsights: {
      actionVerbs: 10,
      quantifiableAchievements: 7,
      educationFound: true,
      experienceYears: 5,
    },
  },
];

export function analyzeResume(fileName: string): ResumeAnalysis {
  // Simulate AI analysis by generating random but realistic data
  const jobRole = mockJobRoles[Math.floor(Math.random() * mockJobRoles.length)];
  const allKeywords = jobRole.keywords;
  
  // Randomly select matched and missing skills
  const shuffled = [...allKeywords].sort(() => 0.5 - Math.random());
  const matchedCount = Math.floor(Math.random() * 5) + 4; // 4-8 matched skills
  const matchedSkills = shuffled.slice(0, matchedCount);
  const missingSkills = shuffled.slice(matchedCount);
  
  const score = Math.min(95, Math.max(60, 60 + matchedCount * 5 + Math.floor(Math.random() * 10)));
  
  const suggestions = [
    'Add more quantifiable achievements with specific metrics and percentages',
    `Include additional ${jobRole.title} skills like ${missingSkills[0]} and ${missingSkills[1]}`,
    'Use stronger action verbs to describe your accomplishments',
    'Add a professional summary highlighting your key strengths and experience',
    'Consider adding relevant certifications or professional development courses',
    'Improve formatting consistency and visual hierarchy',
  ];

  return {
    id: `resume-${Date.now()}`,
    fileName,
    uploadDate: new Date().toISOString().split('T')[0],
    score,
    matchedSkills,
    missingSkills,
    suggestions: suggestions.slice(0, Math.floor(Math.random() * 2) + 4),
    jobRole: jobRole.title,
    extractedText: 'Sample extracted resume text...',
    keyInsights: {
      actionVerbs: Math.floor(Math.random() * 8) + 5,
      quantifiableAchievements: Math.floor(Math.random() * 6) + 3,
      educationFound: Math.random() > 0.2,
      experienceYears: Math.floor(Math.random() * 8) + 2,
    },
  };
}
