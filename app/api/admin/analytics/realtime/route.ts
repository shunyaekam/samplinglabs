import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const hours = parseInt(searchParams.get('hours') || '24')
  const latest = searchParams.get('latest') === 'true'

  try {
    const now = new Date()
    const startTime = new Date(now.getTime() - (hours * 60 * 60 * 1000))

    // Get analytics data points
    const analyticsData = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: {
          gte: startTime
        }
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    // Get active sessions
    const activeSessions = await prisma.session.count({
      where: {
        expires: {
          gt: now
        }
      }
    })

    // Get today's completions and enrollments
    const todayStart = new Date(now.setHours(0, 0, 0, 0))
    const [completions, enrollments] = await Promise.all([
      prisma.enrollment.count({
        where: {
          completedAt: {
            gte: todayStart
          }
        }
      }),
      prisma.enrollment.count({
        where: {
          createdAt: {
            gte: todayStart
          }
        }
      })
    ])

    if (latest) {
      // Return only the latest data point
      return NextResponse.json({
        activeUsers: activeSessions,
        completions,
        enrollments,
        timestamp: now.toISOString()
      })
    }

    // Group data into hourly intervals
    const hourlyData = Array.from({ length: hours }, (_, i) => {
      const hourTime = new Date(now.getTime() - (i * 60 * 60 * 1000))
      const hourEvents = analyticsData.filter(event => 
        event.timestamp.getTime() >= hourTime.getTime() &&
        event.timestamp.getTime() < hourTime.getTime() + 3600000
      )

      return {
        activeUsers: hourEvents.reduce((sum, event) => sum + (event.activeUsers || 0), 0),
        completions: hourEvents.reduce((sum, event) => sum + (event.completions || 0), 0),
        enrollments: hourEvents.reduce((sum, event) => sum + (event.enrollments || 0), 0),
        timestamp: hourTime.toISOString()
      }
    }).reverse()

    return NextResponse.json({
      activeUsers: hourlyData.map(d => d.activeUsers),
      completions: hourlyData.map(d => d.completions),
      enrollments: hourlyData.map(d => d.enrollments),
      timestamps: hourlyData.map(d => d.timestamp)
    })
  } catch (error) {
    console.error('Error fetching real-time analytics:', error)
    return new NextResponse('Error fetching analytics', { status: 500 })
  }
} 