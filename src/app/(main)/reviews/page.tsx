'use client'

import { useState, useEffect } from 'react'
import { Star, MessageCircle } from 'lucide-react'

interface Review {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(setReviews)
      .catch(() => {})
  }, [])

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#f0d6de] rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-[#d4869c]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">Customer Reviews</h1>
          <p className="text-[#8a7a6e] text-sm mt-2">See what our customers are saying</p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#f0e6d8]">
            <p className="text-[#8a7a6e]">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-[#f0e6d8] p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-[#4a3730]">{review.name}</p>
                  <span className="text-xs text-[#8a7a6e]">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-[#6a5a4e] text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
