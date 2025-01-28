import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth/[...nextauth]/route'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string, sectionId: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, content, order } = body

    const section = await prisma.courseSection.update({
      where: { 
        id: params.sectionId,
        courseId: params.id
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(order && { order })
      }
    })

    // Update vector store if content changed
    if (content) {
      await indexCourseContent(params.id, content)
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error updating section:', error)
    return new NextResponse('Error updating section', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string, sectionId: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await prisma.courseSection.delete({
      where: {
        id: params.sectionId,
        courseId: params.id
      }
    })

    // Reorder remaining sections
    const remainingSections = await prisma.courseSection.findMany({
      where: { courseId: params.id },
      orderBy: { order: 'asc' }
    })

    await Promise.all(
      remainingSections.map((section, index) =>
        prisma.courseSection.update({
          where: { id: section.id },
          data: { order: index }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting section:', error)
    return new NextResponse('Error deleting section', { status: 500 })
  }
} 