import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb'

const client = new ChromaClient()
const embedder = new OpenAIEmbeddingFunction(process.env.OPENAI_API_KEY!)

// Simple in-memory store
type DocumentChunk = {
  id: string
  content: string
  embedding: number[]
  metadata: {
    courseId: string
  }
}

let documentStore: DocumentChunk[] = []

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.deepseek.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: 'deepseek-embed-v1'
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate embeddings')
  }

  const data = await response.json()
  return data.data[0].embedding
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export async function processContent(content: string, courseId: string) {
  try {
    // Split content into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const chunks = await splitter.splitText(content)

    // Get or create collection for the course
    const collection = await client.getOrCreateCollection({
      name: `course_${courseId}`,
      embeddingFunction: embedder,
    })

    // Add documents to collection
    await collection.add({
      ids: chunks.map((_, i) => `chunk_${i}`),
      documents: chunks,
      metadatas: chunks.map(() => ({ courseId })),
    })

    return true
  } catch (error) {
    console.error('Error processing content:', error)
    throw error
  }
}

export async function queryContent(query: string, courseId?: string): Promise<string[]> {
  try {
    if (!courseId) {
      return []
    }

    const collection = await client.getCollection({
      name: `course_${courseId}`,
      embeddingFunction: embedder,
    })

    const results = await collection.query({
      queryTexts: [query],
      nResults: 3,
    })

    return results.documents[0] || []
  } catch (error) {
    console.error('Error querying content:', error)
    throw error
  }
}

// Optional: Clear store (useful for testing)
export function clearStore() {
  documentStore = []
} 