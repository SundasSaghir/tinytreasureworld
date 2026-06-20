'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X, Heart } from 'lucide-react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateCounts = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(Array.isArray(cart) ? cart.length : 0);
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
      } catch {
        setCartCount(0);
        setWishlistCount(0);
      }
    };
    updateCounts();
    window.addEventListener('storage', updateCounts);
    return () => window.removeEventListener('storage', updateCounts);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fff8ee]/95 backdrop-blur-sm shadow-sm border-b border-[#f0e6d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Tiny Treasure World"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="hidden sm:inline text-lg font-bold text-[#4a3730] tracking-tight">
              Tiny Treasure World
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#5a4a3e] hover:text-[#d4869c] font-medium transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/wishlist" className="relative p-2 text-[#5a4a3e] hover:text-[#d4869c] transition-colors" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#5a4a3e] hover:text-[#d4869c] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <Link href="/cart" className="relative p-2 text-[#5a4a3e] hover:text-[#d4869c] transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4a574] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#5a4a3e] hover:text-[#d4869c] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8dccc] bg-[#f5ede0]/50 focus:outline-none focus:ring-2 focus:ring-[#d4869c]/40 focus:border-transparent text-sm text-[#4a3730] placeholder-[#8a7a6e]"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7a6e]" />
            </form>
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#f0e6d8] pt-4">
            <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 py-2.5 text-[#5a4a3e] hover:text-[#d4869c] font-medium transition-colors">
              <Heart size={16} /> Wishlist
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2.5 text-[#5a4a3e] hover:text-[#d4869c] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
