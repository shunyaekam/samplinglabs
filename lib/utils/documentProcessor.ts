import { encode } from 'gpt-tokenizer'

interface DocumentChunk {
  text: string
  metadata: {
    courseId: string
    title: string
    location?: string
  }
}

export function chunkDocument(
  text: string,
  courseId: string,
  title: string,
  maxTokens: number = 512
): DocumentChunk[] {
  const chunks: DocumentChunk[] = []
  const sentences = text.split(/[.!?]+\s+/)
  let currentChunk = ''
  let currentTokens = 0

  for (const sentence of sentences) {
    const sentenceTokens = encode(sentence).length
    
    if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
      chunks.push({
        text: currentChunk.trim(),
        metadata: {
          courseId,
          title,
          location: `chunk-${chunks.length + 1}`
        }
      })
      currentChunk = ''
      currentTokens = 0
    }
    
    currentChunk += sentence + '. '
    currentTokens += sentenceTokens
  }

  if (currentChunk) {
    chunks.push({
      text: currentChunk.trim(),
      metadata: {
        courseId,
        title,
        location: `chunk-${chunks.length + 1}`
      }
    })
  }

  return chunks
}

export async function processDocument(
  content: string,
  courseId: string,
  title: string
): Promise<DocumentChunk[]> {
  // Remove any special characters and normalize whitespace
  const cleanedText = content
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,!?-]/g, '')
    .trim()

  return chunkDocument(cleanedText, courseId, title)
} 