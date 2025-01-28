'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginForm() {
  const [userType, setUserType] = useState<'employee' | 'admin'>('employee')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle authentication
    if (userType === 'employee') {
      router.push('/dashboard/employee')
    } else {
      router.push('/dashboard/admin')
    }
  }

  return (
    <div className="card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to LearningHub</h1>
        <p className="text-gray-600 mt-2">Sign in to access your learning platform</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          className={`flex-1 py-2 rounded-lg transition-colors duration-200 
            ${userType === 'employee' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50'}`}
          onClick={() => setUserType('employee')}
        >
          Employee
        </button>
        <button
          className={`flex-1 py-2 rounded-lg transition-colors duration-200 
            ${userType === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50'}`}
          onClick={() => setUserType('admin')}
        >
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Sign In
        </button>
      </form>
    </div>
  )
} 