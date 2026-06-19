'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [siteEmail, setSiteEmail] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: any[]) => {
        const getVal = (key: string) => data.find((s: any) => s.key === key)?.value || ''
        setAddress(getVal('address'))
        setSiteEmail(getVal('email'))
        let num = getVal('whatsapp_number').replace(/[^0-9]/g, '')
        if (num.startsWith('0')) num = '92' + num.slice(1)
        if (num && !num.startsWith('92')) num = '92' + num
        setWhatsapp(num)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4a3730] mb-3">Contact Us</h1>
        <p className="text-[#6a5a4e]">
          We would love to hear from you. Get in touch with us!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="bg-white rounded-xl border border-green-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={28} className="text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-[#4a3730] mb-2">Message Sent!</h2>
              <p className="text-[#6a5a4e] mb-4">
                Thank you for reaching out. We will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#d48e66] to-[#c07850] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e0d4c4] p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#4a3730] mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4a3730] mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4a3730] mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="03XX-XXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4a3730] mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d48e66]/20 bg-[#f0d6de]/30 focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30 focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d48e66] to-[#c07850] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Message'}
                <Send size={16} />
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#e0d4c4] p-6 space-y-6">
            <h2 className="text-lg font-bold text-[#4a3730]">Get in Touch</h2>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-[#d48e66] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#4a3730]">Address</p>
                <p className="text-sm text-[#6a5a4e]">{address || '123 Kids Lane, Suite 100, New York, NY 10001'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={20} className="text-[#d48e66] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#4a3730]">Phone</p>
                <a href={`tel:+${whatsapp}`} className="text-sm text-[#d48e66] hover:underline">
                  {whatsapp ? `+${whatsapp}` : '+1 (234) 567-890'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={20} className="text-[#d48e66] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#4a3730]">Email</p>
                <a href={`mailto:${siteEmail || 'info@tinytreasureworld.com'}`} className="text-sm text-[#d48e66] hover:underline">
                  {siteEmail || 'info@tinytreasureworld.com'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle size={20} className="text-[#d48e66] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#4a3730]">WhatsApp</p>
                <a
                  href={`https://wa.me/${whatsapp || '923001234567'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-500 hover:underline"
                >
                  Chat with us
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#f5ede0] to-[#f0d6de]/50 rounded-xl border border-[#e0d4c4] p-6 h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="mx-auto text-[#f0d6de] mb-2" />
              <p className="text-[#8a7a6e] text-sm">Map will be displayed here</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#d48e66] to-[#c07850] rounded-xl p-6 text-white text-center">
            <h3 className="font-bold text-lg mb-1">Follow Us</h3>
            <p className="text-sm text-white/80">Stay connected for exclusive offers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
