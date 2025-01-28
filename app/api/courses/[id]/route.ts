import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // First get the params promise
    const params = (await import('next/headers')).headers()
      .get('x-next-params')
      ?.split('/')
      .filter(p => p)
      .reduce((acc, cur, i, arr) => {
        if (i % 2 === 0) acc[cur] = arr[i + 1]
        return acc
      }, {} as Record<string, string>)

    if (!params?.id) {
      return new Response(JSON.stringify({ error: 'Invalid course ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Then proceed with session check
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Now safely access params after async operations
    const { id } = params

    const course = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        status: true,
        fileType: true,
        originalFileName: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!course) {
      return new Response(JSON.stringify({ error: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Debug log
    console.log('Found course:', {
      id: course.id,
      title: course.title,
      contentLength: course.content?.length || 0,
      hasContent: !!course.content
    })

    return new Response(JSON.stringify(course), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error fetching course:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch course' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 