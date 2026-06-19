'use client'

import { useEffect, useState } from 'react'
import { Trash2, Star } from 'lucide-react'

interface Review {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchReviews() {
    setLoading(true)
    try {
      const res = await fetch('/api/reviews?all=true')
      if (res.ok) setReviews(await res.json())
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch {}
  }

  async function handleDeleteAll() {
    if (!confirm('Delete ALL reviews? This cannot be undone.')) return
    try {
      const res = await fetch('/api/reviews', { method: 'DELETE' })
      if (res.ok) setReviews([])
    } catch {}
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Reviews</h1>
        {reviews.length > 0 && (
          <button onClick={handleDeleteAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-md hover:bg-red-100 transition-colors">
            <Trash2 size={14} /> Delete All
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No reviews yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Comment</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{review.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{review.comment}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(review.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
