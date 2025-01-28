'use client'

export default function ProgressOverview() {
  const learningStats = {
    completionRate: 65,
    hoursSpent: 24,
    certificatesEarned: 3,
    streak: 7
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress circle */}
            <circle
              className="text-indigo-600 transform -rotate-90 origin-center"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45 * learningStats.completionRate / 100} ${2 * Math.PI * 45}`}
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-indigo-600">
              {learningStats.completionRate}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{learningStats.hoursSpent}h</p>
          <p className="text-sm text-gray-500">Time Spent</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{learningStats.certificatesEarned}</p>
          <p className="text-sm text-gray-500">Certificates</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{learningStats.streak} days</p>
          <p className="text-sm text-gray-500">Learning Streak</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-green-600">+12%</p>
          <p className="text-sm text-gray-500">vs Last Month</p>
        </div>
      </div>
    </div>
  )
} 