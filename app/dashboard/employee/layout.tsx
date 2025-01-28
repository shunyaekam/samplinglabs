import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'

export default async function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return <DashboardLayout>{children}</DashboardLayout>
} 