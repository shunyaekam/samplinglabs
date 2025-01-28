import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, domain, employeeCount } = body

    const enterprise = await prisma.enterprise.create({
      data: {
        name,
        domain,
        employeeCount
      }
    })

    return NextResponse.json(enterprise)
  } catch (error) {
    console.error('Error creating enterprise:', error)
    return new NextResponse('Error creating enterprise', { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const enterprises = await prisma.enterprise.findMany({
      include: {
        _count: {
          select: { employees: true }
        }
      }
    })

    return NextResponse.json(enterprises)
  } catch (error) {
    console.error('Error fetching enterprises:', error)
    return new NextResponse('Error fetching enterprises', { status: 500 })
  }
} 