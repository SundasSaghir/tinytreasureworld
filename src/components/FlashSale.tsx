'use client';

import { useState, useEffect } from 'react';

interface SaleProduct {
  id: string;
  name: string;
  price: number;
  salePrice: number;
  images?: string[];
  stock: number;
}

interface FlashSaleProps {
  products: SaleProduct[];
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4a3730] mb-2">Flash Sale</h2>
          <div className="inline-flex items-center gap-2 bg-[#d48e66] text-white px-4 py-2 rounded-full font-semibold text-sm sm:text-base">
            <span>&#9200;</span>
            <span>Ends in: {formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-[#d48e66]/20 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="relative aspect-square bg-[#f5ede0] overflow-hidden">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#d48e66]/20 text-4xl">&#127873;</div>
                )}
                <span className="absolute top-2 left-2 bg-[#d48e66] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  -{Math.round((1 - product.salePrice / product.price) * 100)}%
                </span>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-[#4a3730] text-sm leading-tight mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-[#d48e66]">${product.salePrice.toFixed(2)}</span>
                  <span className="text-xs sm:text-sm text-[#8a7a6e] line-through">${product.price.toFixed(2)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
