'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ShoppingBag, AlertTriangle, XCircle, ArrowRight, DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalOrders: number
  lowStock: number
  outOfStock: number
  todayIncome: number
  yesterdayIncome: number
  monthlyIncome: number
  yearlyIncome: number
  todayOrders: number
  monthlyOrders: number
}

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customerName: string
  phone: string
  city: string
  address: string
  notes: string
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
}

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('/api/inventory/stats'),
          fetch('/api/orders?admin=true'),
        ])
        if (statsRes.ok) {
          setStats(await statsRes.json())
        }
        if (ordersRes.ok) {
          const orders: Order[] = await ordersRes.json()
          setRecentOrders(orders.slice(0, 5))
        }
      } catch {}
    }
    fetchData()
  }, [])

  const dashboardCards = [
    { label: "Today's Income", value: stats ? `Rs ${stats.todayIncome.toLocaleString()}` : '0', icon: DollarSign, color: 'bg-emerald-500' },
    { label: "Today's Orders", value: stats?.todayOrders ?? 0, icon: ShoppingBag, color: 'bg-cyan-500' },
    { label: 'Monthly Orders', value: stats?.monthlyOrders ?? 0, icon: BarChart3, color: 'bg-indigo-500' },
    { label: 'Monthly Income', value: stats ? `Rs ${stats.monthlyIncome.toLocaleString()}` : '0', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Low Stock', value: stats?.lowStock ?? 0, icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Out of Stock', value: stats?.outOfStock ?? 0, icon: XCircle, color: 'bg-red-500' },
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-blue-500' },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-5">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-gray-800">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                </div>
                <div className={`${card.color} p-2 rounded-full`}>
                  <Icon size={15} className="text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#d4869c] hover:text-[#d4869c] flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-gray-700">#{order.id.slice(-6)}</td>
                    <td className="px-5 py-3 text-gray-700">{order.customerName}</td>
                    <td className="px-5 py-3 text-gray-700">Rs {order.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Quick Links</h2>
          </div>
          <div className="p-5 space-y-3">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700"
            >
              <Package size={18} className="text-[#d4869c]" />
              <span className="text-sm font-medium">Manage Products</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700"
            >
              <AlertTriangle size={18} className="text-[#d4869c]" />
              <span className="text-sm font-medium">Manage Categories</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ShoppingBag size={18} className="text-[#d4869c]" />
              <span className="text-sm font-medium">View Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
