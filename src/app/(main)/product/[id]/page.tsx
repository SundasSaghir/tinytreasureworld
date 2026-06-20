'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Share2, Minus, Plus, ChevronLeft, Star, AlertCircle } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState<any[]>([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [stockErr, setStockErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setProduct(data);
        const relRes = await fetch(`/api/products?category=${data.category}`);
        if (relRes.ok) {
          const all = await relRes.json();
          setRelated(all.filter((p: any) => p.id !== id).slice(0, 4));
        }
      } catch {} finally { setLoading(false); }
    }
    load();
  }, [id]);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setInWishlist(Array.isArray(wishlist) && wishlist.some((w: any) => w.productId === id))
    } catch {}
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      if (product) {
        const updated = [product.id, ...viewed.filter((v: string) => v !== product.id)].slice(0, 8);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      }
    } catch {}
  }, [product, id]);

  const inStock = product?.stock > 0;
  const isOnSale = product?.salePrice != null;

  function toggleWishlist() {
    try {
      let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]') || []
      if (inWishlist) {
        wishlist = wishlist.filter((w: any) => w.productId !== id)
      } else {
        wishlist.push({
          productId: id,
          name: product.name,
          price: product.salePrice || product.price,
          image: product.images?.[0] || '',
        })
        fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: id,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.images?.[0] || '',
          }),
        }).catch(() => {})
      }
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
      setInWishlist(!inWishlist)
      window.dispatchEvent(new Event('storage'))
    } catch {}
  }

  function addToCart() {
    if (quantity > product.stock) {
      setStockErr('Sorry, only ' + product.stock + ' available')
      setTimeout(() => setStockErr(null), 4000)
      return
    }
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.findIndex((item: any) => item.productId === product.id);
      const totalQty = existing >= 0 ? cart[existing].quantity + quantity : quantity;
      if (totalQty > product.stock) {
        setStockErr('Sorry, only ' + product.stock + ' available for "' + product.name + '"')
        setTimeout(() => setStockErr(null), 4000)
        return
      }
      if (existing >= 0) {
        cart[existing].quantity = totalQty;
      } else {
        cart.push({
          productId: product.id, name: product.name,
          price: isOnSale ? product.salePrice : product.price,
          quantity, image: product.images?.[0] || '',
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {}
  }

  function shareProduct(platform: string) {
    const url = window.location.href;
    const text = 'Check out ' + product.name + ' at Tiny Treasure World!';
    const urls: Record<string, string> = {
      whatsapp: 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url),
      facebook: 'https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),
      messenger: 'fb-messenger://share?link=' + encodeURIComponent(url),
    };
    window.open(urls[platform] || urls.whatsapp, '_blank');
  }

  const images = product?.images?.length > 0 ? product.images : ['/images/products/placeholder.svg'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-[#6a5a4e] hover:text-[#d4869c] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#f5ede0] rounded-2xl overflow-hidden group">
            <Image
              src={images[selectedImage]}
              alt={product?.name || ''}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {isOnSale && (
              <span className="absolute top-4 left-4 bg-[#d4a574] text-white text-sm font-bold px-3 py-1 rounded-full">
                Sale
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={'relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ' + (i === selectedImage ? 'border-[#d4869c]' : 'border-[#f0e6d8] hover:border-[#d4869c]/50')}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-[#8a7a6e] uppercase tracking-wide mb-1">{product?.category}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4a3730] leading-tight">{product?.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            {isOnSale ? (
              <>
                <span className="text-3xl font-bold text-[#d4869c]">Rs {product?.salePrice?.toLocaleString()}</span>
                <span className="text-lg text-[#8a7a6e] line-through">Rs {product?.price?.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-[#4a3730]">Rs {product?.price?.toLocaleString()}</span>
            )}
          </div>

          {stockErr && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle size={16} />
              {stockErr}
            </div>
          )}

          <div className="flex items-center gap-2">
            {inStock ? (
              product.stock <= 5 ? (
                <span className="text-sm text-red-500 font-semibold">Only {product.stock} left in stock</span>
              ) : (
                <span className="text-sm text-[#d48e66] font-medium">In Stock</span>
              )
            ) : (
              <span className="text-sm text-gray-500 font-semibold">Sold Out</span>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-[#4a3730] mb-2">Description</h3>
            <p className="text-[#6a5a4e] text-sm leading-relaxed">{product?.description}</p>
          </div>

          {inStock ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#e0d4c4] rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-[#d4869c] transition-colors">
                  <Minus size={18} />
                </button>
                <span className="px-4 font-medium text-[#4a3730] min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:text-[#d4869c] transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={addToCart}
                className={'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ' + (added ? 'bg-[#d48e66] text-white' : 'bg-[#d4869c] text-white hover:bg-[#c07088]')}
              >
                <ShoppingBag size={18} />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={toggleWishlist}
                className={'p-3 rounded-xl border transition-all ' + (inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-[#e0d4c4] text-[#6a5a4e] hover:bg-[#f5ede0]')}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleWishlist}
              className={'flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold border-2 transition-all ' + (inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-[#d4869c]/30 text-[#d4869c] hover:bg-[#f5ede0]')}
            >
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              {inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-[#f0e6d8]">
            <span className="text-sm text-[#6a5a4e]">Share:</span>
            {[
              { key: 'whatsapp', label: 'WhatsApp', color: 'hover:bg-[#25D366]' },
              { key: 'facebook', label: 'Facebook', color: 'hover:bg-[#1877F2]' },
            ].map((s) => (
              <button key={s.key} onClick={() => shareProduct(s.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5ede0] text-[#6a5a4e] hover:text-white transition-all text-xs font-medium">
                <Share2 size={14} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-[#4a3730] mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p: any) => (
              <Link key={p.id} href={'/product/' + p.id}
                className="group bg-white rounded-xl border border-[#f0e6d8] overflow-hidden hover:shadow-md hover:border-[#d4869c]/30 transition-all">
                <div className="relative aspect-square bg-[#f5ede0]">
                  <Image src={p.images?.[0] || '/images/products/placeholder.svg'} alt={p.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.salePrice && <span className="absolute top-2 left-2 bg-[#d4a574] text-white text-xs font-bold px-2 py-0.5 rounded-full">Sale</span>}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-[#4a3730] text-sm truncate">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {p.salePrice ? (
                      <>
                        <span className="font-bold text-[#d4869c] text-sm">Rs {p.salePrice.toLocaleString()}</span>
                        <span className="text-xs text-[#8a7a6e] line-through">Rs {p.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="font-bold text-[#4a3730] text-sm">Rs {p.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
