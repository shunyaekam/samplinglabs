'use client'

import { useState } from 'react'

interface PathStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'inProgress' | 'locked'
  courses: string[]
}

export default function LearningPath() {
  const [steps] = useState<PathStep[]>([
    {
      id: '1',
      title: 'Onboarding',
      description: 'Essential company knowledge and policies',
      status: 'completed',
      courses: ['Company Culture', 'HR Policies']
    },
    {
      id: '2',
      title: 'Role-Specific Training',
      description: 'Skills required for your position',
      status: 'inProgress',
      courses: ['Technical Skills', 'Project Management']
    },
    {
      id: '3',
      title: 'Professional Development',
      description: 'Advanced skills and leadership training',
      status: 'locked',
      courses: ['Leadership Fundamentals', 'Strategic Planning']
    }
  ])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Your Learning Path</h2>
      </div>

      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="relative pb-8">
            {index < steps.length - 1 && (
              <div className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-gray-200" />
            )}
            <div className="relative flex items-start group">
              <span className="h-9 flex items-center">
                <span className={`
                  relative z-10 w-8 h-8 flex items-center justify-center rounded-full
                  ${step.status === 'completed' ? 'bg-green-500' :
                    step.status === 'inProgress' ? 'bg-blue-500' : 'bg-gray-300'}
                  ${step.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}>
                  {step.status === 'completed' ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-white font-medium">{index + 1}</span>
                  )}
                </span>
              </span>
              <div className="ml-4 min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <p className="text-sm text-gray-500">{step.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {step.courses.map((course) => (
                    <span
                      key={course}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 