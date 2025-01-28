const ADMIN_EMAILS = ['aryan.s.shisodiya@gmail.com']

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  console.log('Checking admin status for:', email) // Debug log
  const isAdminUser = ADMIN_EMAILS.includes(email.toLowerCase())
  console.log('Is admin?', isAdminUser) // Debug log
  return isAdminUser
} 