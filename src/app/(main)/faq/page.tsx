'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our shop, add items to your cart, and proceed to checkout. Fill in your details and place your order via WhatsApp. We will confirm your order within a few hours.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, EasyPaisa, JazzCash, and cash on delivery (COD) for select cities.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Orders are processed within 24 hours. Delivery typically takes 2-5 business days depending on your location.',
  },
  {
    question: 'Do you offer cash on delivery?',
    answer: 'Yes, we offer cash on delivery in select cities. The availability will be shown at checkout based on your city.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 7-day return policy on all products. Items must be unworn with original packaging. Contact us via WhatsApp to initiate a return.',
  },
  {
    question: 'Can I change or cancel my order?',
    answer: 'You can modify or cancel your order within 2 hours of placing it. Please contact us on WhatsApp as soon as possible.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we only deliver within Pakistan. We are working on expanding internationally soon!',
  },
  {
    question: 'Are your products safe for kids?',
    answer: 'Yes, all our products are made from child-safe, non-toxic materials. We carefully select each item to ensure the highest safety standards.',
  },
  {
    question: 'How can I contact customer support?',
    answer: 'You can reach us via WhatsApp, email at info@tinytreasureworld.com, or through the contact form on our website.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4a3730] mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-[#6a5a4e]">
          Everything you need to know about ordering from Tiny Treasure World
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-[#e0d4c4] overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-[#4a3730] hover:bg-[#f5ede0] transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={18}
                className={`text-[#8a7a6e] transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-80' : 'max-h-0'
              }`}
            >
              <p className="px-6 pb-4 text-[#6a5a4e] text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-gradient-to-r from-[#f5ede0] to-[#f0d6de]/50 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-[#4a3730] mb-2">
          Still have questions?
        </h2>
        <p className="text-[#6a5a4e] mb-4">
          We are here to help. Reach out to us anytime.
        </p>
        <a
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
