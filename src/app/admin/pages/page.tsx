'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'

export default function AdminPagesPage() {
  const [about, setAbout] = useState({ title: '', content: '' })
  const [returns, setReturns] = useState({ title: '', content: '' })
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: any[]) => {
        const getVal = (key: string) => data.find((s: any) => s.key === key)?.value || ''
        try {
          const a = JSON.parse(getVal('page_about') || '{}')
          setAbout({ title: a.title || 'About Us', content: a.content || '' })
        } catch { setAbout({ title: 'About Us', content: '' }) }
        try {
          const r = JSON.parse(getVal('page_returns') || '{}')
          setReturns({ title: r.title || 'Returns & Refunds', content: r.content || '' })
        } catch { setReturns({ title: 'Returns & Refunds', content: '' }) }
      })
      .catch(() => {})
  }, [])

  async function savePage(key: string, data: any) {
    setSaving(key)
    setMessage('')
    try {
      const res = await fetch('/api/settings/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: JSON.stringify(data) }),
      })
      if (res.ok) setMessage(`${data.title} saved successfully!`)
      else setMessage('Failed to save')
    } catch { setMessage('Failed to save') }
    setSaving(null)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Page Content</h1>

      {message && (
        <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* About Us */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">About Us Page</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={about.title}
                onChange={(e) => setAbout((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                rows={8}
                value={about.content}
                onChange={(e) => setAbout((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/50 text-gray-700 resize-y"
                placeholder="Write about your store, mission, team..."
              />
            </div>
            <button
              onClick={() => savePage('page_about', about)}
              disabled={saving === 'page_about'}
              className="flex items-center gap-2 bg-[#d4869c] hover:bg-[#c07088] text-white px-5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving === 'page_about' ? 'Saving...' : 'Save About Us'}
            </button>
          </div>
        </div>

        {/* Returns & Refunds */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Returns & Refunds Page</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={returns.title}
                onChange={(e) => setReturns((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                rows={8}
                value={returns.content}
                onChange={(e) => setReturns((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/50 text-gray-700 resize-y"
                placeholder="Write your returns policy, conditions, process..."
              />
            </div>
            <button
              onClick={() => savePage('page_returns', returns)}
              disabled={saving === 'page_returns'}
              className="flex items-center gap-2 bg-[#d4869c] hover:bg-[#c07088] text-white px-5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving === 'page_returns' ? 'Saving...' : 'Save Returns & Refunds'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
