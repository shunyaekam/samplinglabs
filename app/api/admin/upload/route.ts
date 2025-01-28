import { NextResponse } from 'next/server'
import { processContent } from '@/lib/utils/vectorStore'
import { prisma } from '@/lib/prisma'
import PDFParser from 'pdf-parse'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

// Remove Edge Runtime as it doesn't work well with Prisma
// export const runtime = 'edge'

// Remove the config export as it's not needed in App Router
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

export async function POST(req: Request) {
  // Add CORS headers
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const courseName = formData.get('courseName') as string | null

    if (!file || !courseName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const MAX_FILE_SIZE = 1024 * 1024 * 20 // 20MB

    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 20MB limit' }),
        {
          status: 413,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Extract text content
    let textContent: string
    const buffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(buffer)
    
    try {
      if (file.type.includes('pdf')) {
        try {
          const pdfData = await PDFParser(fileBuffer, {
            max: 1024 * 1024 * 20 // 20MB
          })
          textContent = pdfData.text
        } catch (error) {
          console.error('PDF parsing error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to parse PDF file' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        }
      } else {
        textContent = await file.text()
      }

      if (!textContent.trim()) {
        throw new Error('No text content could be extracted')
      }

      console.log('Content extracted successfully, length:', textContent.length)
    } catch (error) {
      console.error('Content extraction error:', error)
      return new Response(JSON.stringify({ error: 'Failed to extract content from file' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    // Create course and process content
    try {
      const course = await prisma.course.create({
        data: {
          title: courseName,
          description: `Uploaded from ${file.name}`,
          status: 'ACTIVE',
          fileType: file.type,
          originalFileName: file.name,
          content: textContent,
        }
      })

      console.log('Course created:', course.id)

      // Process content for RAG
      await processContent(textContent, course.id)
      console.log('Content processed successfully')

      return new Response(JSON.stringify({
        success: true,
        courseId: course.id,
        message: 'Course uploaded successfully'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return new Response(JSON.stringify({ error: 'Failed to save course to database' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 