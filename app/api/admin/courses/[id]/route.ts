import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Delete all related data first
    await prisma.$transaction([
      prisma.enrollment.deleteMany({
        where: { courseId: params.id }
      }),
      prisma.courseSection.deleteMany({
        where: { courseId: params.id }
      }),
      prisma.course.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return new NextResponse('Error deleting course', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        fileType: true,
        originalFileName: true,
        content: true,
        createdAt: true,
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description } = body

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        description
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return new NextResponse('Error updating course', { status: 500 })
  }
} 