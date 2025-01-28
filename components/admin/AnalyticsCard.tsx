interface AnalyticsCardProps {
  title: string
  value: string | number
  trend: string
}

export default function AnalyticsCard({ title, value, trend }: AnalyticsCardProps) {
  const isPositive = trend.startsWith('+')

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  )
} 