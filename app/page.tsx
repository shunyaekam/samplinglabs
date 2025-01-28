import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession()
  
  if (session) {
    redirect('/dashboard/employee')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-indigo-600">Enterprise LMS</div>
          <div className="space-x-4">
            <Link href="/login" className="btn-primary">
              Sign In
            </Link>
            <Link href="/enterprise/register" className="btn-secondary">
              Register Enterprise
            </Link>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Enterprise Learning Management System
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Empower your workforce with comprehensive learning solutions. 
              Track progress, manage courses, and drive professional development.
            </p>
            <div className="space-x-4">
              <Link 
                href="/login" 
                className="btn-primary"
              >
                Get Started
              </Link>
              <Link 
                href="/about" 
                className="btn-secondary"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/enterprise-learning.svg" 
              alt="Enterprise Learning" 
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
