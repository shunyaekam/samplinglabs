import { OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { PineconeClient } from '@pinecone-database/pinecone'
import { prisma } from '@/lib/prisma'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const CHUNK_SIZE = 1000
const CHUNK_OVERLAP = 200

export async function initVectorStore() {
  const client = new PineconeClient()
  await client.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  })
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX!)
  
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  return { client, pineconeIndex, embeddings }
}

export async function vectorizeCourse(courseId: string) {
  const { pineconeIndex, embeddings } = await initVectorStore()

  try {
    // Get course content
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, content: true }
    })
    if (!course) throw new Error('Course not found')

    // Split content into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    })
    const chunks = await splitter.createDocuments([course.content])

    // Process chunks in batches
    const batchSize = 5
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      
      // Create embeddings for batch
      const texts = batch.map(chunk => chunk.pageContent)
      const embeddings = await embeddings.embedDocuments(texts)

      // Store in Pinecone and database
      await Promise.all(batch.map(async (chunk, idx) => {
        const vectorId = `${courseId}-${i + idx}`
        
        // Store in Pinecone
        await pineconeIndex.upsert([{
          id: vectorId,
          values: embeddings[idx],
          metadata: {
            courseId,
            text: chunk.pageContent,
            location: i + idx,
          }
        }])

        // Store in database
        await prisma.courseVector.create({
          data: {
            courseId,
            chunk: chunk.pageContent,
            embedding: embeddings[idx],
            metadata: {
              location: i + idx,
              title: course.title
            }
          }
        })
      }))
    }

    // Update course status
    await prisma.course.update({
      where: { id: courseId },
      data: { status: 'ACTIVE' }
    })

    return true
  } catch (error) {
    console.error('Vectorization error:', error)
    await prisma.course.update({
      where: { id: courseId },
      data: { 
        status: 'ERROR',
        metadata: {
          vectorizationError: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
    throw error
  }
}

export async function queryVectorStore(query: string, limit: number = 3) {
  try {
    const queryEmbedding = await embeddings.embedQuery(query)
    
    const results = await pineconeIndex.query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true
    })

    return results.matches.map(match => ({
      text: match.metadata.text,
      courseId: match.metadata.courseId,
      title: match.metadata.title,
      score: match.score
    }))
  } catch (error) {
    console.error('Error querying vector store:', error)
    throw error
  }
} 