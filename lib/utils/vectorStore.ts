import { HfInference } from '@huggingface/inference'
import { PrismaClient } from '@prisma/client'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const prisma = new PrismaClient()
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

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
  try {
    const response = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    })
    return response
  } catch (error) {
    console.error('Embedding generation failed:', error)
    throw new Error('Failed to generate text embedding')
  }
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export async function processContent(text: string, courseId: string) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })
    
    const documents = await splitter.createDocuments([text])
    
    // Process chunks in batches to avoid memory issues
    const batchSize = 10
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      
      // Generate embeddings for batch
      const embeddings = await Promise.all(
        batch.map(doc => generateEmbedding(doc.pageContent))
      )
      
      // Store batch in database
      await prisma.$transaction(
        embeddings.map((embedding, index) => 
          prisma.documentChunk.create({
            data: {
              content: batch[index].pageContent,
              embedding,
              courseId
            }
          })
        )
      )
    }
  } catch (error) {
    console.error('Content processing failed:', error)
    throw error
  }
}

export async function queryContent(query: string, courseId: string): Promise<string[]> {
  try {
    const queryEmbedding = await generateEmbedding(query)
    
    // Use PostgreSQL's vector similarity search
    const results = await prisma.$queryRaw`
      SELECT content, embedding <=> ${queryEmbedding}::vector AS distance
      FROM "DocumentChunk"
      WHERE "courseId" = ${courseId}
      ORDER BY distance ASC
      LIMIT 3;
    `
    
    return (results as any[]).map(r => r.content)
  } catch (error) {
    console.error('Query failed:', error)
    throw error
  }
}

// Optional: Clear store (useful for testing)
export function clearStore() {
  documentStore = []
} 