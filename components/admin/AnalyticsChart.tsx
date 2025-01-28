'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface AnalyticsChartProps {
  timeRange: string
}

export default function AnalyticsChart({ timeRange }: AnalyticsChartProps) {
  const data = {
    labels: ['Course A', 'Course B', 'Course C', 'Course D'],
    datasets: [
      {
        label: 'Completion Rate',
        data: [65, 45, 80, 30],
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  return <Bar data={data} options={options} />
} 