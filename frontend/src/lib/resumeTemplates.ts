export interface ResumeTemplate {
  id: string
  name: string
  description: string
  pdfPreview: string
  category: 'professional' | 'modern' | 'creative' | 'technical'
  design: {
    primaryColor: string
    layout: 'single-column' | 'two-column' | 'mixed'
    fontStyle: 'serif' | 'sans-serif'
    accentStyle: 'line' | 'color-block' | 'minimal' | 'icons'
  }
  bestFor: string[]
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'aditya',
    name: 'Professional Clean',
    description: 'Clean and professional with centered name and underlined sections',
    pdfPreview: '/templates/Aditya_Resume_Review - Aditya Sharma.pdf',
    category: 'professional',
    design: {
      primaryColor: '#000000',
      layout: 'single-column',
      fontStyle: 'sans-serif',
      accentStyle: 'line'
    },
    bestFor: ['Software Engineer', 'General Professional', 'Corporate Jobs']
  },
  {
    id: 'arushi',
    name: 'Blue Accent',
    description: 'Modern design with blue horizontal lines and centered header',
    pdfPreview: '/templates/Arushi_DataAnalyst.pdf',
    category: 'modern',
    design: {
      primaryColor: '#0066CC',
      layout: 'single-column',
      fontStyle: 'sans-serif',
      accentStyle: 'color-block'
    },
    bestFor: ['Data Analyst', 'Business Analyst', 'Consultant']
  },
  {
    id: 'hemant',
    name: 'Orange Professional',
    description: 'Professional with orange accent line and mixed layout',
    pdfPreview: '/templates/Hemant-Java-Dev.pdf',
    category: 'modern',
    design: {
      primaryColor: '#FF6600',
      layout: 'mixed',
      fontStyle: 'sans-serif',
      accentStyle: 'line'
    },
    bestFor: ['Java Developer', 'Backend Engineer', 'Technical Lead']
  },
  {
    id: 'datascience',
    name: 'Two-Column Technical',
    description: 'Left sidebar for contact, right content area for details',
    pdfPreview: '/templates/data-science-tech-resume-template.pdf',
    category: 'technical',
    design: {
      primaryColor: '#333333',
      layout: 'two-column',
      fontStyle: 'sans-serif',
      accentStyle: 'minimal'
    },
    bestFor: ['Data Scientist', 'ML Engineer', 'Research Engineer']
  },
  {
    id: 'mukesh',
    name: 'Social Links Pro',
    description: 'Centered name with social links and clean underlined sections',
    pdfPreview: '/templates/Mukesh_Kuiry_Resume (4) - Mukesh Kuiry.pdf',
    category: 'professional',
    design: {
      primaryColor: '#000000',
      layout: 'single-column',
      fontStyle: 'sans-serif',
      accentStyle: 'line'
    },
    bestFor: ['Full Stack Developer', 'Web Developer', 'Software Engineer']
  },
  {
    id: 'prankush',
    name: 'Bold & Icons',
    description: 'Bold name with email icon and horizontal line separators',
    pdfPreview: '/templates/Prankush - Prankush Giri.pdf',
    category: 'modern',
    design: {
      primaryColor: '#000000',
      layout: 'single-column',
      fontStyle: 'sans-serif',
      accentStyle: 'icons'
    },
    bestFor: ['Frontend Developer', 'UI Developer', 'Creative Tech']
  },
  {
    id: 'sameer',
    name: 'Diamond Bullets',
    description: 'Professional with diamond bullets and education table format',
    pdfPreview: '/templates/Resume_March_2024_WP - Sameer Chauhan (1).pdf',
    category: 'professional',
    design: {
      primaryColor: '#000000',
      layout: 'single-column',
      fontStyle: 'sans-serif',
      accentStyle: 'minimal'
    },
    bestFor: ['Software Developer', 'Backend Developer', 'System Engineer']
  },
  // {
  //   id: 'sameer-alt',
  //   name: 'Diamond Bullets Alt',
  //   description: 'Alternative version with diamond bullets and clean sections',
  //   pdfPreview: '/templates/Resume_March_2024_WP - Sameer Chauhan.pdf',
  //   category: 'professional',
  //   design: {
  //     primaryColor: '#000000',
  //     layout: 'single-column',
  //     fontStyle: 'sans-serif',
  //     accentStyle: 'minimal'
  //   },
  //   bestFor: ['Software Developer', 'Backend Developer', 'System Engineer']
  // },
  {
    id: 'rishabh',
    name: 'Classic Professional',
    description: 'Clean professional layout with standard bullet points',
    pdfPreview: '/templates/Rishabh_Resume - Rishabh Bajpai.pdf',
    category: 'professional',
    design: {
      primaryColor: '#000000',
      layout: 'single-column',
      fontStyle: 'sans-serif',
      accentStyle: 'minimal'
    },
    bestFor: ['Software Engineer', 'Full Stack Developer', 'General Tech']
  }
]

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ResumeTemplate | undefined {
  return resumeTemplates.find(template => template.id === id)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): ResumeTemplate[] {
  return resumeTemplates.filter(template => template.category === category)
}

/**
 * Get all template categories
 */
export function getTemplateCategories(): string[] {
  return Array.from(new Set(resumeTemplates.map(t => t.category)))
}
