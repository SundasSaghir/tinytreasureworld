'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  images?: string[];
  stock: number;
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const imageUrl = product.images?.[0] || '/placeholder.png';
  const isOutOfStock = product.stock === 0;
  const isOnSale = !!product.salePrice && product.salePrice < product.price;

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsWishlisted(wishlist.some((item: Product) => item.id === product.id));
    } catch {
      setIsWishlisted(false);
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (isWishlisted) {
        const updated = wishlist.filter((item: Product) => item.id !== product.id);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setIsWishlisted(false);
      } else {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setIsWishlisted(true);
      }
    } catch {
      localStorage.setItem('wishlist', JSON.stringify([product]));
      setIsWishlisted(true);
    }
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingIndex = cart.findIndex((item: Product) => item.id === product.id);
      if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    } catch {
      localStorage.setItem('cart', JSON.stringify([{ ...product, quantity: 1 }]));
      window.dispatchEvent(new Event('storage'));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group block bg-white rounded-2xl overflow-hidden border border-[#f0e6d8] transition-all duration-300 ${
        isOutOfStock ? 'opacity-75' : 'hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      <div className="relative aspect-square bg-[#f5ede0] overflow-hidden">
        {imageUrl !== '/placeholder.png' && imageUrl !== '/images/products/placeholder.svg' ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d48e66]/30">
            <ShoppingBag size={48} />
          </div>
        )}

        {isOnSale && (
          <span className="absolute top-2 left-2 bg-[#d48e66] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Sale
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-2 left-2 bg-[#8a7a6e] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        <button
          onClick={toggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all ${
            isWishlisted ? 'text-[#d48e66]' : 'text-[#8a7a6e] hover:text-[#d48e66]'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4">
        {product.category && (
          <p className="text-xs text-[#8a7a6e] uppercase tracking-wide mb-1">{product.category}</p>
        )}
        <h3 className="font-semibold text-[#4a3730] text-sm leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {isOnSale ? (
            <>
              <span className="text-lg font-bold text-[#d48e66]">Rs {product.salePrice!.toFixed(2)}</span>
              <span className="text-sm text-[#8a7a6e] line-through">Rs {product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-[#4a3730]">Rs {product.price.toFixed(2)}</span>
          )}
        </div>
        <button
          onClick={addToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-[#e0d4c4] text-[#8a7a6e] cursor-not-allowed'
              : isAdded
              ? 'bg-[#d48e66] text-white'
              : 'bg-[#d48e66] text-white hover:bg-[#c07850]'
          }`}
        >
          <ShoppingBag size={16} />
          {isOutOfStock ? 'Unavailable' : isAdded ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
