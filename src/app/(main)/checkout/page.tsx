'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Star, X } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [freeShippingMin, setFreeShippingMin] = useState(0);
  const [deliveryChargeRate, setDeliveryChargeRate] = useState(0);
  const [currency, setCurrency] = useState('Rs');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: any[]) => {
        const getVal = (key: string) => data.find((s: any) => s.key === key)?.value || ''
        setFreeShippingMin(Number(getVal('free_shipping_min')) || 0)
        setDeliveryChargeRate(Number(getVal('delivery_charge')) || 0)
        setCurrency(getVal('currency') || 'Rs')
      })
      .catch(() => {})
  }, [])

  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart) || cart.length === 0) {
        router.push('/cart');
        return;
      }
      setCartItems(cart);
    } catch {
      router.push('/cart');
    }
    setIsLoaded(true);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const charge = freeShippingMin > 0 && subtotal >= freeShippingMin ? 0 : deliveryChargeRate;
  const total = subtotal + charge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          city: form.city,
          address: form.address,
          notes: form.notes,
          items: cartItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      let whatsappNumber = '923001234567';
      try {
        const settingsRes = await fetch('/api/settings');
        const settings = await settingsRes.json();
        const wp = settings.find((s: any) => s.key === 'whatsapp_number');
        if (wp) {
          let num = wp.value.replace(/[^0-9]/g, '');
          if (num.startsWith('0')) num = '92' + num.slice(1);
          if (!num.startsWith('92')) num = '92' + num;
          whatsappNumber = num;
        }
      } catch {
        // use default
      }

      const itemsText = cartItems
        .map((item) => `- ${item.name} x${item.quantity} = Rs ${(item.price * item.quantity).toLocaleString()}`)
        .join('\n');

      const message = `🛍️ *New Order - Tiny Treasure World*

*Customer Details:*
Name: ${form.name}
Phone: ${form.phone}
City: ${form.city}
Address: ${form.address}
Notes: ${form.notes || 'N/A'}

*Products Ordered:*
${itemsText}

*Total Amount: Rs ${total.toLocaleString()}*`;

      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage'));

      setShowReview(true);
      setReviewForm((prev) => ({ ...prev, name: form.name }));

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded || cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#d48e66]/20 border-t-[#d48e66] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/cart" className="text-[#8a7a6e] hover:text-[#d48e66] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-[#e0d4c4] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#4a3730] mb-6">Delivery Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4a3730] mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4a3730] mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="03XX-XXXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#4a3730] mb-1.5">City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#4a3730] mb-1.5">Complete Address *</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="House/Flat No., Street, Area, Landmark"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm resize-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#4a3730] mb-1.5">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any special instructions?"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm resize-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-[#e0d4c4] p-6 sticky top-24">
              <h2 className="text-lg font-bold text-[#4a3730] mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#f5ede0] rounded-lg flex items-center justify-center text-[#d48e66]/20 text-xl flex-shrink-0">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#4a3730] truncate">{item.name}</p>
                      <p className="text-xs text-[#8a7a6e]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#4a3730]">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-[#e0d4c4] mb-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6a5a4e]">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6a5a4e]">
                  <span>Delivery</span>
                  <span>
                    {charge === 0 ? (
                      <span className="text-green-500 font-medium">Free</span>
                    ) : (
                      `Rs ${charge}`
                    )}
                  </span>
                </div>
                {deliveryChargeRate > 0 && freeShippingMin > 0 && subtotal < freeShippingMin && subtotal > 0 && (
                  <p className="text-xs text-[#8a7a6e]">
                    Add Rs {(freeShippingMin - subtotal).toLocaleString()} more for free delivery
                  </p>
                )}
                <hr className="border-[#e0d4c4]" />
                <div className="flex justify-between font-bold text-[#4a3730] text-base">
                  <span>Total</span>
                  <span>Rs {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d48e66] to-[#c07850] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? 'Processing...' : 'Place Order on WhatsApp'}
              </button>

              <p className="text-xs text-[#8a7a6e] text-center mt-3">
                By placing this order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </form>

      {showReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowReview(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-green-500 fill-green-500" />
                </div>
                <h3 className="text-lg font-bold text-[#4a3730] mb-2">Thank You!</h3>
                <p className="text-sm text-[#8a7a6e] mb-4">Your review has been posted.</p>
                <Link href="/reviews" className="text-[#d4869c] hover:underline text-sm font-medium">
                  View all reviews
                </Link>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#4a3730] mb-1">Love Your Order?</h3>
                <p className="text-sm text-[#8a7a6e] mb-5">Leave a review and help others!</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a3730] mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e0d4c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/40 text-[#4a3730]"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4a3730] mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}>
                          <Star size={28} className={star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4a3730] mb-1">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e0d4c4] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/40 text-[#4a3730] resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <button
                    onClick={async () => {
                      if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return
                      setReviewSaving(true)
                      try {
                        await fetch('/api/reviews', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(reviewForm),
                        })
                        setReviewSubmitted(true)
                      } catch {}
                      setReviewSaving(false)
                    }}
                    disabled={reviewSaving || !reviewForm.name.trim() || !reviewForm.comment.trim()}
                    className="w-full py-3 bg-[#d48e66] text-white font-medium rounded-xl hover:bg-[#c07850] transition-colors disabled:opacity-50"
                  >
                    {reviewSaving ? 'Submitting...' : 'Submit Review'}
                  </button>

                  <p className="text-xs text-[#8a7a6e] text-center">
                    <button onClick={() => setShowReview(false)} className="hover:underline">Skip</button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
