import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import { JSDOM } from 'jsdom'

interface ParsedContent {
  modules: {
    title: string
    order: number
    lessons: {
      title: string
      content: string
      order: number
      metadata?: {
        tags?: string[]
        difficulty?: string
        type?: string
      }
    }[]
  }[]
}

export async function parseContent(content: string, fileType: string): Promise<ParsedContent> {
  switch (fileType) {
    case 'pdf':
      return createDefaultStructure(content, 'PDF Content')
    case 'docx':
      return createDefaultStructure(content, 'DOCX Content')
    case 'txt':
    case 'md':
      return parseMarkdownContent(content)
    default:
      return createDefaultStructure(content, 'Document Content')
  }
}

async function parseMarkdownContent(content: string): Promise<ParsedContent> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content)

  const dom = new JSDOM(result.toString())
  const document = dom.window.document

  // Parse headers to identify modules and lessons
  const modules: ParsedContent['modules'] = []
  let currentModule: typeof modules[0] | null = null
  
  document.querySelectorAll('h1, h2, p').forEach((element, index) => {
    if (element.tagName === 'H1') {
      // New module
      currentModule = {
        title: element.textContent || `Module ${modules.length + 1}`,
        order: modules.length,
        lessons: []
      }
      modules.push(currentModule)
    } else if (element.tagName === 'H2' && currentModule) {
      // New lesson
      currentModule.lessons.push({
        title: element.textContent || `Lesson ${currentModule.lessons.length + 1}`,
        content: '',
        order: currentModule.lessons.length,
        metadata: {
          tags: [],
          difficulty: 'beginner'
        }
      })
    } else if (currentModule && currentModule.lessons.length > 0) {
      // Add content to current lesson
      const currentLesson = currentModule.lessons[currentModule.lessons.length - 1]
      currentLesson.content += element.outerHTML
    }
  })

  // If no modules were created, create a default one
  if (modules.length === 0) {
    return createDefaultStructure(content, 'Markdown Content')
  }

  return { modules }
}

// Helper function to create a default structure for unsupported or simple files
function createDefaultStructure(content: string, title: string): ParsedContent {
  return {
    modules: [
      {
        title: 'Main Content',
        order: 0,
        lessons: [
          {
            title,
            content: `<div class="whitespace-pre-wrap">${content}</div>`,
            order: 0,
            metadata: {
              tags: [],
              difficulty: 'beginner',
              type: 'document'
            }
          }
        ]
      }
    ]
  }
}

// Implement PDF and DOCX parsers similarly
// You'll need additional libraries for these formats 