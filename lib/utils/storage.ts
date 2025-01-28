interface CourseSection {
  title: string
  content: string
}

interface Course {
  id: string
  title: string
  sections: CourseSection[]
  category: string
  duration: string
  progress: number
  thumbnail?: string
  metadata?: {
    keywords: string[]
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    objectives: string[]
  }
}

// Simulated storage for demo purposes
export const demoStorage = {
  courses: new Map<string, Course>(),

  saveContent: (courseId: string, content: string) => {
    const course = demoStorage.courses.get(courseId)
    if (course) {
      // Parse content into sections if it contains markdown headers
      const sections = content.split(/(?=^#{1,2}\s)/m)
        .filter(Boolean)
        .map(section => {
          const [title, ...contentParts] = section.split('\n')
          return {
            title: title.replace(/^#{1,2}\s/, '').trim(),
            content: contentParts.join('\n').trim()
          }
        })

      course.sections = sections
      demoStorage.courses.set(courseId, course)
    }
  },

  getContent: (courseId: string) => {
    const course = demoStorage.courses.get(courseId)
    if (!course) return null

    // Combine all sections into a single string for AI processing
    return course.sections
      .map(section => `# ${section.title}\n\n${section.content}`)
      .join('\n\n')
  },

  searchContent: (query: string) => {
    const results: Array<{ courseId: string; relevance: number }> = []
    
    demoStorage.courses.forEach((course, courseId) => {
      const content = demoStorage.getContent(courseId)
      if (!content) return

      // Simple relevance scoring based on term frequency
      const relevance = (content.toLowerCase().match(new RegExp(query.toLowerCase(), 'g')) || []).length
      if (relevance > 0) {
        results.push({ courseId, relevance })
      }
    })

    return results.sort((a, b) => b.relevance - a.relevance)
  }
}

// Initialize with some demo content
demoStorage.courses.set('1', {
  id: '1',
  title: 'Introduction to Company Culture',
  sections: [
    {
      title: 'Welcome',
      content: 'Welcome to our company culture course. This course will help you understand our values and practices.'
    },
    {
      title: 'Core Values',
      content: 'Our core values include integrity, innovation, and collaboration. These values guide everything we do.'
    }
  ],
  category: 'Onboarding',
  duration: '2 hours',
  progress: 45,
  metadata: {
    keywords: ['culture', 'values', 'onboarding'],
    difficulty: 'beginner',
    objectives: [
      'Understand company values',
      'Learn about company culture',
      'Familiarize with company practices'
    ]
  }
}) 