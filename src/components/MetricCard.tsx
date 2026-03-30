import { ArrowUp, ArrowDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  color: string
}

export function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const isPositive = change > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
          <div className={`flex items-center space-x-1 mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}</span>
          </div>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
