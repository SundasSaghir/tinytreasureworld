'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'

interface WishlistItem {
  productId: string
  name: string
  price: number
  image?: string
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    async function load() {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        const local = Array.isArray(wishlist) ? wishlist : []

        // Sync with server — remove items deleted by admin
        const res = await fetch('/api/wishlist')
        if (res.ok) {
          const serverItems = await res.json()
          const serverIds = new Set(serverItems.map((s: any) => s.productId))
          const filtered = local.filter((item: WishlistItem) => serverIds.has(item.productId))
          if (filtered.length !== local.length) {
            localStorage.setItem('wishlist', JSON.stringify(filtered))
            window.dispatchEvent(new Event('storage'))
          }
          setItems(filtered)
        } else {
          setItems(local)
        }
      } catch {
        setItems([])
      }
    }
    load()
  }, [])

  function removeFromWishlist(productId: string) {
    const updated = items.filter((item) => item.productId !== productId)
    setItems(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  function addToCart(item: WishlistItem) {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existing = cart.findIndex((c: any) => c.productId === item.productId)
      if (existing >= 0) {
        cart[existing].quantity += 1
      } else {
        cart.push({ productId: item.productId, name: item.name, price: item.price, quantity: 1, image: item.image || '' })
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('storage'))
      alert('Added to cart!')
    } catch {}
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#f0d6de] rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-[#d4869c]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">My Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#f0e6d8]">
            <Heart size={48} className="text-[#d4869c]/30 mx-auto mb-3" />
            <p className="text-[#6a5a4e] font-medium mb-2">Your wishlist is empty</p>
            <p className="text-[#8a7a6e] text-sm mb-4">Save items you love by tapping the heart icon</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d48e66] text-white text-sm font-medium rounded-xl hover:bg-[#c07850] transition-colors">
              <ShoppingBag size={16} /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-xl border border-[#f0e6d8] p-4 hover:shadow-md transition-shadow">
                <Link href={'/product/' + item.productId}>
                  <div className="w-full h-40 bg-[#f5ede0] rounded-lg mb-3 flex items-center justify-center text-[#d48e66]/30 text-4xl overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      '🎀'
                    )}
                  </div>
                  <h3 className="font-medium text-[#4a3730] text-sm truncate">{item.name}</h3>
                  <p className="text-[#d48e66] font-bold text-sm mt-1">Rs {item.price.toLocaleString()}</p>
                </Link>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => addToCart(item)} className="flex-1 py-2 bg-[#d48e66] text-white text-xs font-medium rounded-lg hover:bg-[#c07850] transition-colors">
                    Add to Cart
                  </button>
                  <button onClick={() => removeFromWishlist(item.productId)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
