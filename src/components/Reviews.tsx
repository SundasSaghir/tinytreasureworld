'use client';

import { Star } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  comment: string;
}

interface ReviewsProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-[#a09080]'}
        />
      ))}
    </div>
  );
}

export default function Reviews({ reviews }: ReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#4a3730] mb-8">What Our Customers Say</h2>
          <div className="bg-[#f5ede0] rounded-2xl p-12 border border-[#e0d4c4]">
            <div className="text-5xl mb-4">&#128221;</div>
            <p className="text-[#8a7a6e] text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#4a3730] text-center mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-[#e0d4c4] shadow-sm hover:shadow-md transition-shadow"
            >
              <StarRating rating={review.rating} />
              <p className="text-[#6a5a4e] text-sm mt-3 mb-4 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
              <p className="font-semibold text-[#4a3730] text-sm">- {review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
