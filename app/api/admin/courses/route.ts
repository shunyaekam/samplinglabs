import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { enrollments: true }
        },
        enrollments: {
          select: {
            completed: true
          }
        }
      }
    })

    const formattedCourses = courses.map(course => {
      const completedCount = course.enrollments.filter(e => e.completed).length
      const completionRate = course.enrollments.length > 0
        ? Math.round((completedCount / course.enrollments.length) * 100)
        : 0

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        enrolledCount: course._count.enrollments,
        completionRate,
        createdAt: course.createdAt
      }
    })

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return new NextResponse('Error fetching courses', { status: 500 })
  }
} 