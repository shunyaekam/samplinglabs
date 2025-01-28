interface AchievementCardProps {
  title: string
  value: string
  description: string
}

export default function AchievementCard({ title, value, description }: AchievementCardProps) {
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  )
} 