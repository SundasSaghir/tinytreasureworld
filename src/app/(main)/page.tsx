'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Tag, Clock, Heart, Star, ChevronRight, ShoppingCart } from 'lucide-react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-[#f0d6de] border-t-[#d48e66] rounded-full animate-spin" />
    </div>
  );
}

function HeroBanner() {
  const [banners, setBanners] = useState<{ id: string; title: string; subtitle: string; image: string; link: string }[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.json())
      .then(data => setBanners(data.filter((b: any) => b.active)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f5ede0] via-[#faf9f5] to-[#f0d6de]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="animate-fadeIn">
            {banners.length > 1 && (
              <span className="inline-block px-3 py-1 bg-white/60 text-[#d48e66] text-xs font-semibold rounded-full mb-4">
                {current + 1} / {banners.length}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4a3730] leading-tight mb-4">
              {banner.title}
            </h1>
            {banner.subtitle && (
              <p className="text-[#6a5a4e] text-sm sm:text-base mb-6 max-w-lg">
                {banner.subtitle}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href={banner.link || '/shop'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#d48e66] text-white font-medium rounded-xl hover:bg-[#c07850] transition-colors shadow-lg shadow-[#d48e66]/30"
              >
                Shop Now
                <ChevronRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#6a5a4e] font-medium rounded-xl hover:bg-[#f5ede0] transition-colors border border-[#e0d4c4]"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center animate-fadeIn">
            <div className="w-80 h-80 bg-white/40 rounded-full flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-[#f0d6de] to-[#f0d6de] rounded-full flex items-center justify-center overflow-hidden">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-6xl">🎀</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-[#d48e66] w-6' : 'bg-white/60 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent" />
    </section>
  );
}

function CategorySection({ categories }: { categories: any[] }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">Shop by Category</h2>
          <Link href="/shop" className="text-sm text-[#d48e66] hover:underline font-medium">
            View All
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="px-5 py-2.5 bg-white rounded-full border border-[#f0e6d8] text-sm font-medium text-[#6a5a4e] hover:bg-[#d48e66] hover:text-white hover:border-[#d48e66] transition-colors shadow-sm"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlashSale({ products }: { products: any[] }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, expired: true });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((settings: any[]) => {
        const enabled = settings.find((s: any) => s.key === 'flash_sale_enabled');
        if (enabled?.value !== 'true') {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
          return;
        }
        const endSetting = settings.find((s: any) => s.key === 'flash_sale_end');
        if (!endSetting || !endSetting.value) {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
          return;
        }
        const end = new Date(endSetting.value).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        if (diff <= 0) {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
          return;
        }
        setTimeLeft({
          hours: Math.floor(diff / 3600),
          minutes: Math.floor((diff % 3600) / 60),
          seconds: diff % 60,
          expired: false,
        });
      })
      .catch(() => setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true }));
  }, []);

  useEffect(() => {
    if (timeLeft.expired) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.expired) return prev;
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59, expired: false };
        return { hours: 0, minutes: 0, seconds: 0, expired: true };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft.expired]);

  if (timeLeft.expired) return null;

  return (
    <section className="py-12 bg-gradient-to-r from-[#f5ede0] to-[#f0d6de]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">Flash Sale</h2>
            <p className="text-[#8a7a6e] text-sm">Limited time offers</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#6a5a4e]">Ends in:</span>
            <div className="flex gap-1.5">
              {[
                { label: 'Hrs', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm min-w-[42px]">
                    <span className="text-lg font-bold text-[#d48e66]">{String(unit.value).padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-[#8a7a6e] mt-0.5 block">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
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
      className="group bg-white rounded-xl border border-[#f0e6d8] overflow-hidden hover:shadow-lg hover:border-[#d48e66]/30 transition-all"
    >
      <div className="relative aspect-square bg-[#f5ede0] overflow-hidden">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#d48e66]/30 text-5xl">🎀</div>
        )}
        {product.salePrice && (
          <span className="absolute top-2 left-2 bg-[#d48e66] text-white text-xs font-bold px-2 py-0.5 rounded-full">SALE</span>
        )}
        {product.stock <= 0 ? (
          <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Sold Out</span>
        ) : product.stock <= 5 ? (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        ) : null}
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

function ReviewsSection({ reviews }: { reviews: any[] }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  return (
    <section className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">What Our Customers Say</h2>
          <p className="text-[#8a7a6e] text-sm mt-2">Hear from happy parents</p>
        </div>
        <div className="relative overflow-hidden">
          <div
            className="flex gap-3 transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${offset * 208}px)` }}
          >
            {reviews.concat(reviews).map((review, index) => (
              <div
                key={index}
                className="w-[190px] sm:w-[200px] bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-lg shadow-[#d4869c]/5 shrink-0"
              >
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-[#6a5a4e] text-xs leading-relaxed mb-2 italic line-clamp-2">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <p className="font-semibold text-[#4a3730] text-xs">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setOffset(i)}
              className={`h-2 rounded-full transition-all ${i === offset % reviews.length ? 'bg-[#d48e66] w-6' : 'bg-[#f0d6de] w-2'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const [catRes, featRes, bestRes, allRes, revRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products?featured=true'),
        fetch('/api/products?bestSeller=true'),
        fetch('/api/products'),
        fetch('/api/reviews'),
      ]);

      const [categories, featured, bestSellers, allProducts, reviews] = await Promise.all([
        catRes.json(),
        featRes.json(),
        bestRes.json(),
        allRes.json(),
        revRes.json(),
      ]);

      setCategories(categories);
      setFeaturedProducts(featured.slice(0, 8));
      setBestSellers(bestSellers.slice(0, 8));
      setSaleProducts(allProducts.filter((p: any) => p.salePrice != null));
      setReviews(reviews);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const onFocus = () => fetchData();
    const onVisible = () => { if (!document.hidden) fetchData(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    const interval = setInterval(fetchData, 10000);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(interval);
    };
  }, []);

  if (loading) return <Loading />;

  const whyChooseUs = [
    { icon: Shield, title: 'Quality Products', description: 'Handpicked premium accessories made from safe, durable materials for your little ones.' },
    { icon: Tag, title: 'Affordable Prices', description: 'Competitive pricing without compromising on quality. Best value for your money.' },
    { icon: Clock, title: 'Fast Response', description: 'Quick order processing and prompt customer support to answer all questions.' },
    { icon: Heart, title: 'Trusted Store', description: 'Thousands of happy customers trust us for their kids accessory needs.' },
  ];

  return (
    <div>
      <HeroBanner />
      {categories.length > 0 && <CategorySection categories={categories} />}
      {saleProducts.length > 0 && <FlashSale products={saleProducts} />}

      {featuredProducts.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">Featured Products</h2>
                <p className="text-[#8a7a6e] text-sm">Our top picks for your little ones</p>
              </div>
              <Link href="/shop" className="text-sm text-[#d48e66] hover:underline font-medium">View All</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="py-12 bg-[#f5ede0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">Best Sellers</h2>
                <p className="text-[#8a7a6e] text-sm">Most loved by our customers</p>
              </div>
              <Link href="/shop" className="text-sm text-[#d48e66] hover:underline font-medium">View All</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestSellers.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">Why Choose Us</h2>
            <p className="text-[#8a7a6e] text-sm mt-2">What makes us different</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-[#f0e6d8] p-6 text-center hover:shadow-md hover:border-[#d48e66]/30 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-[#f0d6de] to-[#f0e6d8] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-[#d48e66]" />
                </div>
                <h3 className="font-semibold text-[#4a3730] mb-2">{item.title}</h3>
                <p className="text-[#6a5a4e] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} />
    </div>
  );
}
