'use client'

import { useEffect, useState } from 'react'
import { Search, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

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

const statuses = ['pending', 'confirmed', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function fetchOrders() {
    setLoading(true)
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '?admin=true'
      const res = await fetch(`/api/orders${params}`)
      if (res.ok) setOrders(await res.json())
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300)
    return () => clearTimeout(timer)
  }, [search])

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        )
      }
    } catch {}
  }

  async function handleDeleteAll() {
    if (!confirm('Delete ALL orders? This cannot be undone.')) return
    try {
      const res = await fetch('/api/orders', { method: 'DELETE' })
      if (res.ok) setOrders([])
    } catch {}
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        {orders.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            Delete All
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-400">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-gray-700">#{order.id.slice(-6)}</td>
                    <td className="px-5 py-3 text-gray-700">{order.customerName}</td>
                    <td className="px-5 py-3 text-gray-700">{order.phone}</td>
                    <td className="px-5 py-3 text-gray-700">{order.items.length}</td>
                    <td className="px-5 py-3 text-gray-700">Rs {order.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize border-none cursor-pointer focus:outline-none ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="text-gray-700">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {expandedId && (() => {
          const order = orders.find((o) => o.id === expandedId)
          if (!order) return null
          return (
            <div className="border-t border-gray-200 bg-gray-50 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Details</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Name:</span> {order.customerName}</p>
                    <p><span className="font-medium">Phone:</span> {order.phone}</p>
                    <p><span className="font-medium">City:</span> {order.city}</p>
                    <p><span className="font-medium">Address:</span> {order.address}</p>
                    {order.notes && <p><span className="font-medium">Notes:</span> {order.notes}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Ordered Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm text-gray-600 bg-white px-3 py-2 rounded-md border border-gray-200">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500">
                          x{item.quantity} — Rs {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right text-sm font-semibold text-gray-800">
                    Total: Rs {order.total.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
