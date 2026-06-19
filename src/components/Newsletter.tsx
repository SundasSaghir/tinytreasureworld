'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  if (submitted) {
    return (
      <section className="bg-gradient-to-r from-[#f5ede0] to-[#f0d6de]/50 py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e0d4c4]">
            <div className="text-4xl mb-3">&#127881;</div>
            <h3 className="text-xl font-bold text-[#4a3730] mb-2">You&apos;re Subscribed!</h3>
            <p className="text-[#6a5a4e] text-sm">Thank you for joining Tiny Treasure World. Stay tuned for exclusive offers!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-[#f5ede0] to-[#f0d6de]/50 py-12">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-[#4a3730] mb-2">Stay in the Loop</h3>
        <p className="text-[#6a5a4e] text-sm mb-6">
          Get notified about new arrivals, sales, and exclusive deals!
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-[#d48e66]/20 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#d48e66] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
