import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard/employee')
  }

  return <DashboardLayout>{children}</DashboardLayout>
} 