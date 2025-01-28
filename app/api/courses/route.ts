import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// Map MIME types to file extensions
const mimeTypeToExtension = {
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/markdown': 'md',
  'text/csv': 'csv'
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string

    if (!file || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the file extension from MIME type
    const fileType = mimeTypeToExtension[file.type]
    if (!fileType) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    
    const course = await prisma.course.create({
      data: {
        title,
        description: `Course: ${title}`,
        status: 'active',
        fileType, // Store the extension instead of MIME type
        originalFileName: file.name,
        content: fileBuffer.toString('base64'),
        chunks: {
          create: [{ content: 'Initial chunk' }]
        }
      }
    })

    return NextResponse.json({
      id: course.id,
      title: course.title,
      status: course.status
    })

  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
} 