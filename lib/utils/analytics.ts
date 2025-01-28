import { prisma } from '@/lib/prisma'

export async function recordAnalyticsEvent() {
  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))

  try {
    const [activeSessions, completions, enrollments] = await Promise.all([
      prisma.session.count({
        where: {
          expires: {
            gt: now
          }
        }
      }),
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

    await prisma.analyticsEvent.create({
      data: {
        activeUsers: activeSessions,
        completions,
        enrollments
      }
    })
  } catch (error) {
    console.error('Error recording analytics event:', error)
  }
} 