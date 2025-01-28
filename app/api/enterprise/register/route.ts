import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    if (!req.body) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }

    const data = await req.json()

    // Validate required fields
    if (!data.companyName || !data.domain || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create enterprise account
    const enterprise = await prisma.enterprise.create({
      data: {
        name: data.companyName,
        domain: data.domain,
        employeeCount: data.employeeCount,
        admins: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || '',
            role: 'SUPER_ADMIN'
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      enterpriseId: enterprise.id 
    })

  } catch (error) {
    console.error('Enterprise registration failed:', error)
    return NextResponse.json(
      { error: 'Failed to register enterprise' },
      { status: 500 }
    )
  }
} 