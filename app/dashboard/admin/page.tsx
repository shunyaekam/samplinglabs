'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Users', value: '2,451' },
    { name: 'Active Courses', value: '48' },
    { name: 'Completion Rate', value: '85%' },
    { name: 'Total Learning Hours', value: '12,456' },
  ]

  const quickActions = [
    { name: 'Create Course', href: '/dashboard/admin/courses/create', icon: '📚' },
    { name: 'Manage Users', href: '/dashboard/admin/users', icon: '👥' },
    { name: 'View Reports', href: '/dashboard/admin/reports', icon: '📊' },
    { name: 'System Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">{stat.value}</dd>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{action.icon}</span>
              <span className="text-gray-900 font-medium">{action.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 