'use client'

interface CourseProgressProps {
  progress: number
}

export default function CourseProgress({ progress }: CourseProgressProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-32 bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600">{progress}%</span>
    </div>
  )
} 