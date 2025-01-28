import { NextResponse } from 'next/server'
import { processContent } from '@/lib/utils/vectorStore'
import { PrismaClient } from '@prisma/client'
import PDFParser from 'pdf-parse'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const courseName = formData.get('courseName') as string | null

    if (!file || !courseName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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
        const pdfData = await PDFParser(fileBuffer)
        textContent = pdfData.text
      } else {
        textContent = await file.text()
      }

      if (!textContent.trim()) {
        throw new Error('No text content could be extracted')
      }

      console.log('Content extracted successfully, length:', textContent.length)
    } catch (error) {
      console.error('Content extraction error:', error)
      return NextResponse.json(
        { error: 'Failed to extract content from file' },
        { status: 400 }
      )
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
        }
      })

      console.log('Course created:', course.id)

      await processContent(textContent, course.id)
      console.log('Content processed successfully')

      return NextResponse.json({
        success: true,
        courseId: course.id,
        message: 'Course uploaded successfully'
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save course to database' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 