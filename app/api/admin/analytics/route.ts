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
    const [userCount, courseCount] = await Promise.all([
      prisma.user.count(),
      prisma.course.count()
    ])

    // For now, using placeholder completion rate
    const completionRate = 78

    return NextResponse.json({
      activeUsers: userCount,
      completionRate,
      totalCourses: courseCount
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return new NextResponse('Error fetching analytics', { status: 500 })
  }
} 