'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, AlertCircle } from 'lucide-react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [freeShippingMin, setFreeShippingMin] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [currency, setCurrency] = useState('Rs');
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [stockMsg, setStockMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch {
      setCartItems([]);
    }
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: any[]) => {
        const getVal = (key: string) => data.find((s: any) => s.key === key)?.value || ''
        setFreeShippingMin(Number(getVal('free_shipping_min')) || 0)
        setDeliveryCharge(Number(getVal('delivery_charge')) || 0)
        setCurrency(getVal('currency') || 'Rs')
      })
      .catch(() => {})
    fetch('/api/products')
      .then(r => r.json())
      .then((products: any[]) => {
        const map: Record<string, number> = {}
        products.forEach((p: any) => { map[p.id] = p.stock })
        setStockMap(map)
      })
      .catch(() => {})
      .finally(() => setIsLoaded(true))
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (productId: string, delta: number) => {
    const item = cartItems.find(i => i.productId === productId)
    if (!item) return
    const stock = stockMap[productId] || 0
    const newQty = item.quantity + delta
    if (newQty > stock) {
      setStockMsg(`Sorry, only ${stock} available for "${item.name}"`)
      setTimeout(() => setStockMsg(null), 4000)
      return
    }
    setStockMsg(null)
    const updated = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, newQty) }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (productId: string) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    updateCart(updated);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const charge = freeShippingMin > 0 && subtotal >= freeShippingMin ? 0 : deliveryCharge;
  const total = subtotal + charge;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#d48e66]/20 border-t-[#d48e66] rounded-full animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-[#f0d6de] mb-6" />
        <h1 className="text-2xl font-bold text-[#4a3730] mb-2">Your Cart is Empty</h1>
        <p className="text-[#8a7a6e] mb-8">Looks like you have not added anything yet</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d48e66] to-[#c07850] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#4a3730] mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stockMsg && (
          <div className="lg:col-span-3 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle size={16} />
            {stockMsg}
          </div>
        )}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl border border-[#e0d4c4] p-4 flex items-center gap-4"
            >
              <div className="w-20 h-20 bg-[#f5ede0] rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#f0d6de] text-2xl">
                    <ShoppingBag size={28} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.productId}`}
                  className="font-medium text-[#4a3730] hover:text-[#d48e66] transition-colors truncate block"
                >
                  {item.name}
                </Link>
                <p className="text-[#d48e66] font-semibold mt-1">
                  Rs {item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, -1)}
                  className="p-1.5 rounded-lg border border-[#d48e66]/20 text-[#8a7a6e] hover:bg-[#f5ede0] hover:text-[#d48e66] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium text-[#4a3730] text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, 1)}
                  className="p-1.5 rounded-lg border border-[#d48e66]/20 text-[#8a7a6e] hover:bg-[#f5ede0] hover:text-[#d48e66] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <p className="font-semibold text-[#4a3730] w-24 text-right">
                Rs {(item.price * item.quantity).toLocaleString()}
              </p>

              <button
                onClick={() => removeItem(item.productId)}
                className="p-2 text-[#8a7a6e] hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#e0d4c4] p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold text-[#4a3730] mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#6a5a4e]">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#6a5a4e]">
              <span>Delivery Charge</span>
              <span>
                {charge === 0 ? (
                  <span className="text-green-500 font-medium">Free</span>
                ) : (
                  `Rs ${charge}`
                )}
              </span>
            </div>
            {deliveryCharge > 0 && freeShippingMin > 0 && subtotal < freeShippingMin && subtotal > 0 && (
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

          <Link
            href="/checkout"
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d48e66] to-[#c07850] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/shop"
            className="mt-3 w-full flex items-center justify-center gap-2 px-6 py-3 border border-[#d48e66]/20 text-[#6a5a4e] font-medium rounded-xl hover:bg-[#f5ede0] transition-colors"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
