'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, X, ShoppingCart } from 'lucide-react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-[#d48e66]/20 border-t-[#d48e66] rounded-full animate-spin" />
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.findIndex((item: any) => item.productId === product.id);
      if (existing >= 0) {
        cart[existing].quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.salePrice || product.price,
          quantity: 1,
          image: product.images?.[0] || '',
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      alert('Added to cart!');
    } catch {
      // ignore
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl border border-[#e0d4c4] overflow-hidden hover:shadow-lg hover:border-[#d48e66]/30 transition-all"
    >
      <div className="relative aspect-square bg-[#f5ede0] overflow-hidden">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d48e66]/20 text-5xl">🎀</div>
        )}
        {product.salePrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">SALE</span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Only {product.stock} left
          </span>
        )}
        <button
          onClick={addToCart}
          className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-[#d48e66] hover:text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs text-[#8a7a6e] mb-1">{product.category}</p>
        <h3 className="font-medium text-[#4a3730] text-sm truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          {product.salePrice ? (
            <>
              <span className="font-bold text-[#d48e66]">Rs {product.salePrice.toLocaleString()}</span>
              <span className="text-xs text-[#8a7a6e] line-through">Rs {product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="font-bold text-[#4a3730]">Rs {product.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string[];
  createdAt: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        const products = await prodRes.json();
        const categories = await catRes.json();
        setProducts(products);
        setCategories(categories);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchText) {
      const q = searchText.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (minPrice) {
      result = result.filter((p) => (p.salePrice || p.price) >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => (p.salePrice || p.price) <= Number(maxPrice));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, selectedCategory, searchText, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchText('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const hasFilters = selectedCategory || searchText || minPrice || maxPrice;

  if (loading) return <Loading />;

  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-[#4a3730] mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => setSelectedCategory('')}
              className="accent-[#d48e66]"
            />
            <span className="text-sm text-[#6a5a4e]">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.slug}
                onChange={() => setSelectedCategory(cat.slug)}
                className="accent-[#d48e66]"
              />
              <span className="text-sm text-[#6a5a4e]">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-[#4a3730] mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm"
          />
          <span className="text-[#8a7a6e]">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm"
          />
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 text-sm text-[#d48e66] border border-[#d48e66]/20 rounded-lg hover:bg-[#f5ede0] transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">Shop</h1>
          <p className="text-[#8a7a6e] text-sm mt-1">{filteredProducts.length} products found</p>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#d48e66]/20 rounded-xl text-[#6a5a4e] hover:bg-[#f5ede0] transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#e0d4c4] p-5 sticky top-24">
            {sidebarContent}
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[#4a3730]">Filters</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-[#f5ede0] rounded-lg">
                  <X size={20} className="text-[#8a7a6e]" />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7a6e]" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-white text-sm text-[#6a5a4e] focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8a7a6e] text-lg mb-2">No products found</p>
              <p className="text-[#8a7a6e] text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
