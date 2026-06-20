'use client'

import { useEffect, useState } from 'react'
import { Heart, Trash2, ShoppingBag, Search } from 'lucide-react'
import Link from 'next/link'

interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  createdAt: string
}

export default function AdminWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function fetchItems() {
    setLoading(true)
    try {
      const res = await fetch('/api/wishlist?admin=true')
      if (res.ok) setItems(await res.json())
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  async function handleDelete(id: string) {
    try {
      const res = await fetch('/api/wishlist/' + id, { method: 'DELETE' })
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id))
    } catch {}
  }

  async function handleClearAll() {
    if (!confirm('Delete all wishlist items?')) return
    try {
      const res = await fetch('/api/wishlist', { method: 'DELETE' })
      if (res.ok) setItems([])
    } catch {}
  }

  const filtered = search
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items

  const productCount: Record<string, number> = {}
  items.forEach((i) => { productCount[i.productId] = (productCount[i.productId] || 0) + 1 })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Wishlist</h1>
        {items.length > 0 && (
          <button onClick={handleClearAll} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-md hover:bg-red-100 transition-colors">
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-800">{items.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Items</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-2xl font-bold text-gray-800">{Object.keys(productCount).length}</p>
          <p className="text-xs text-gray-500 mt-1">Unique Products</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:col-span-2">
          <p className="text-xs text-gray-500 mb-2">Most Wishlisted</p>
          {Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([pid, count]) => {
            const item = items.find((i) => i.productId === pid)
            return (
              <div key={pid} className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                <Heart size={12} className="text-red-400 flex-shrink-0" />
                <span className="truncate">{item?.name || pid}</span>
                <span className="text-gray-400 ml-auto">{count}x</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by product name..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Date Added</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No wishlist items found</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f5ede0] rounded-lg flex items-center justify-center text-[#d48e66]/30 overflow-hidden flex-shrink-0">
                          {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <Heart size={16} />}
                        </div>
                        <Link href={'/product/' + item.productId} className="font-medium text-gray-700 hover:text-[#d4869c] truncate max-w-[200px]">
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-700">Rs {item.price.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
