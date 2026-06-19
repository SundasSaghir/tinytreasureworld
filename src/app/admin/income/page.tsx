'use client'

import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react'

interface IncomeStats {
  todayIncome: number
  yesterdayIncome: number
  monthlyIncome: number
  yearlyIncome: number
}

export default function AdminIncomePage() {
  const [stats, setStats] = useState<IncomeStats | null>(null)

  useEffect(() => {
    fetch('/api/inventory/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  const cards = [
    { label: "Today's Income", value: stats?.todayIncome ?? 0, icon: DollarSign, color: 'bg-emerald-500' },
    { label: "Yesterday's Income", value: stats?.yesterdayIncome ?? 0, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Monthly Income', value: stats?.monthlyIncome ?? 0, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Yearly Income', value: stats?.yearlyIncome ?? 0, icon: BarChart3, color: 'bg-amber-500' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-5">Income Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">Rs {card.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon size={22} className="text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
