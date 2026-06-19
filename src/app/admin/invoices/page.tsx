'use client'

import { useEffect, useState } from 'react'
import { FileText, Printer, Search, Trash2 } from 'lucide-react'

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

const statusColors: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminInvoicesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/orders?admin=true')
      .then(r => r.json())
      .then(setOrders)
      .catch(() => {})
  }, [])

  const filtered = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  )

  function generateInvoiceNumber(id: string) {
    return `INV-${id.slice(-8).toUpperCase()}`
  }

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status: newStatus } : prev)
      }
    } catch {}
    setUpdating(null)
  }

  function handlePrint() {
    window.print()
  }

  async function handleDeleteAll() {
    if (!confirm('Delete ALL orders/invoices? This cannot be undone.')) return
    try {
      const res = await fetch('/api/orders', { method: 'DELETE' })
      if (res.ok) setOrders([])
    } catch {}
  }

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-[#d4869c] hover:underline mb-4 block"
        >
          &larr; Back to Invoices
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto" id="invoice-print">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Tiny Treasure World</h2>
              <p className="text-xs text-gray-500">Premium Kids Accessories</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{generateInvoiceNumber(selected.id)}</p>
              <p className="text-xs text-gray-500">{new Date(selected.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-700">
            <p className="font-medium">Customer: {selected.customerName}</p>
            <p>Phone: {selected.phone}</p>
            <p>City: {selected.city}</p>
            <p>Address: {selected.address}</p>
            {selected.notes && <p>Notes: {selected.notes}</p>}
          </div>

          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 font-medium text-gray-600">Item</th>
                <th className="pb-2 font-medium text-gray-600">Qty</th>
                <th className="pb-2 font-medium text-gray-600 text-right">Price</th>
                <th className="pb-2 font-medium text-gray-600 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {selected.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 text-gray-700">{item.name}</td>
                  <td className="py-2 text-gray-700">{item.quantity}</td>
                  <td className="py-2 text-gray-700 text-right">Rs {item.price.toLocaleString()}</td>
                  <td className="py-2 text-gray-700 text-right">Rs {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right text-sm font-bold text-gray-800 pt-2 border-t border-gray-200">
            Total: Rs {selected.total.toLocaleString()}
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 print:hidden">
            <span className="text-xs text-gray-500">Status:</span>
            <select
              value={selected.status}
              onChange={(e) => updateStatus(selected.id, e.target.value)}
              disabled={updating === selected.id}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#d4869c]/30"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mt-4 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[selected.status] || 'bg-gray-100 text-gray-700'}`}>
              {selected.status}
            </span>
          </div>
        </div>

        <div className="text-center mt-4 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4869c] text-white text-sm font-medium rounded-lg hover:bg-[#c07088] transition-colors"
          >
            <Printer size={16} /> Print Invoice
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-800">Invoices</h1>
        <div className="flex items-center gap-2">
          {orders.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-md hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} />
              Delete All
            </button>
          )}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/30"
              />
            </div>
          </div>
        </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium">Invoice #</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-700">{generateInvoiceNumber(order.id)}</td>
                <td className="px-4 py-3 text-gray-700">{order.customerName}</td>
                <td className="px-4 py-3 text-gray-700">Rs {order.total.toLocaleString()}</td>
                <td className="px-4 py-3">
                  {updating === order.id ? (
                    <span className="text-xs text-gray-400">Updating...</span>
                  ) : (
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d4869c]/30 ${statusColors[order.status] || ''}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelected(order)}
                    className="flex items-center gap-1 text-xs text-[#d4869c] hover:underline"
                  >
                    <FileText size={14} /> View Invoice
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
