import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { vectorizeCourse } from '@/lib/services/vectorStore'

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

// Remove edge runtime as it conflicts with Prisma
// export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        fileType: true,
        originalFileName: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching courses:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch courses' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = await request.json()
    
    if (!data.title || !data.content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create course first
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description || '',
        status: 'PROCESSING', // New status while vectorizing
        fileType: data.fileType || 'text/plain',
        originalFileName: data.fileName || 'untitled',
        content: data.content,
        metadata: {
          fileSize: data.fileSize,
          uploadedAt: new Date().toISOString()
        }
      }
    })

    // Start vectorization in background
    vectorizeCourse(course.id).catch(error => {
      console.error('Vectorization failed:', error)
    })

    return new Response(JSON.stringify(course), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating course:', error)
    return new Response(JSON.stringify({ error: 'Failed to create course' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 