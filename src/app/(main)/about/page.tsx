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
            <div className="text-[#6a5a4e] text-sm leading-relaxed space-y-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#4a3730] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#4a3730] [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#4a3730] [&_strong]:font-bold [&_strong]:text-[#4a3730] [&_em]:italic" dangerouslySetInnerHTML={{ __html: data.content }} />
          ) : (
            <p className="text-[#8a7a6e] text-sm text-center">Content coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
