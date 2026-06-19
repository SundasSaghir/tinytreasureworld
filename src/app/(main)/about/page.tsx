'use client'

import { useState, useEffect } from 'react'
import { Info } from 'lucide-react'

export default function AboutPage() {
  const [data, setData] = useState({ title: 'About Us', content: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((settings: any[]) => {
        const val = settings.find((s: any) => s.key === 'page_about')?.value
        if (val) {
          try {
            const parsed = JSON.parse(val)
            setData({ title: parsed.title || 'About Us', content: parsed.content || '' })
          } catch {}
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#f0d6de] rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} className="text-[#d4869c]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4a3730]">{data.title}</h1>
        </div>
        <div className="bg-white rounded-xl border border-[#f0e6d8] p-6 sm:p-8">
          {data.content ? (
            data.content.split('\n').map((line, i) => (
              <p key={i} className="text-[#6a5a4e] text-sm leading-relaxed mb-3 last:mb-0">{line}</p>
            ))
          ) : (
            <p className="text-[#8a7a6e] text-sm text-center">Content coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
