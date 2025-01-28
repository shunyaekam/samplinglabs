'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Award,
  BarChart,
  Settings,
  GraduationCap
} from 'lucide-react'

interface SidebarProps {
  isAdmin: boolean
}

export default function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname()

  const adminNavigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Course Management',
      href: '/admin/courses',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      name: 'Enterprise',
      href: '/admin/enterprise',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart className="w-5 h-5" />
    }
  ]

  const employeeNavigation = [
    {
      name: 'Overview',
      href: '/dashboard/employee',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Courses',
      href: '/dashboard/employee/courses',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      name: 'Progress',
      href: '/dashboard/employee/progress',
      icon: <Award className="w-5 h-5" />
    },
    {
      name: 'Learning Paths',
      href: '/dashboard/employee/paths',
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      name: 'Settings',
      href: '/dashboard/employee/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ]

  const navigation = isAdmin ? adminNavigation : employeeNavigation

  return (
    <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <span className="text-xl font-bold text-indigo-600">LearningHub</span>
      </div>
      <div className="mt-8 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span className={`
                  mr-3 flex-shrink-0
                  ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}
                `}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 