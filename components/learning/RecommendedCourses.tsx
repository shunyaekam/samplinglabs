'use client'

export default function RecommendedCourses() {
  const recommendations = [
    {
      title: 'Advanced Project Management',
      category: 'Professional Skills',
      reason: 'Based on your role',
      duration: '4 hours'
    },
    {
      title: 'Data Analysis Fundamentals',
      category: 'Technical',
      reason: 'Popular in your department',
      duration: '3 hours'
    },
    {
      title: 'Effective Communication',
      category: 'Soft Skills',
      reason: 'Trending course',
      duration: '2 hours'
    }
  ]

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((course, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
            <div className="text-sm font-medium text-indigo-600 mb-2">{course.category}</div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{course.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{course.duration}</p>
            <p className="text-xs text-gray-400">{course.reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 