import { NextResponse } from 'next/server'
import { processContent } from '@/lib/utils/vectorStore'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const courseName = formData.get('courseName') as string

    if (!file || !courseName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create course in database
    const course = await prisma.course.create({
      data: {
        name: courseName,
        status: 'ACTIVE',
      }
    })

    // Read and process the file content
    const content = await file.text()
    await processContent(content, course.id.toString())

    return NextResponse.json({ 
      success: true,
      courseId: course.id
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
} 