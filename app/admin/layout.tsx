import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    redirect('/login')
  }

  return <DashboardLayout>{children}</DashboardLayout>
} 