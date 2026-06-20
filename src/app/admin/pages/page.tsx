'use client'

import { useEffect, useState, useRef } from 'react'
import { Save, Bold, Italic, Heading1, Heading2, Heading3, Eye, Code } from 'lucide-react'

export default function AdminPagesPage() {
  const [about, setAbout] = useState({ title: '', content: '' })
  const [returns, setReturns] = useState({ title: '', content: '' })
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const aboutRef = useRef<HTMLTextAreaElement>(null)
  const returnsRef = useRef<HTMLTextAreaElement>(null)

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

  function wrapTag(tag: string, field: 'about' | 'returns') {
    const ref = field === 'about' ? aboutRef : returnsRef
    const setter = field === 'about' ? setAbout : setReturns
    const current = field === 'about' ? about : returns
    const ta = ref.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = current.content.substring(start, end)
    let replacement = ''
    if (tag === 'h1') replacement = `<h1>${selected || 'Heading'}</h1>`
    else if (tag === 'h2') replacement = `<h2>${selected || 'Heading'}</h2>`
    else if (tag === 'h3') replacement = `<h3>${selected || 'Heading'}</h3>`
    else if (tag === 'b') replacement = `<strong>${selected || 'bold text'}</strong>`
    else if (tag === 'i') replacement = `<em>${selected || 'italic text'}</em>`
    else if (tag === 'p') replacement = `\n\n`
    const newContent = current.content.substring(0, start) + replacement + current.content.substring(end)
    setter((prev: any) => ({ ...prev, content: newContent }))
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + replacement.length, start + replacement.length)
    }, 0)
  }

  function Toolbar({ field }: { field: 'about' | 'returns' }) {
    return (
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-300 border-b-0 rounded-t-md">
        <button type="button" onClick={() => wrapTag('h1', field)} title="Heading 1" className="p-1.5 rounded hover:bg-gray-200 text-gray-600">
          <Heading1 size={16} />
        </button>
        <button type="button" onClick={() => wrapTag('h2', field)} title="Heading 2" className="p-1.5 rounded hover:bg-gray-200 text-gray-600">
          <Heading2 size={16} />
        </button>
        <button type="button" onClick={() => wrapTag('h3', field)} title="Heading 3" className="p-1.5 rounded hover:bg-gray-200 text-gray-600">
          <Heading3 size={16} />
        </button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => wrapTag('b', field)} title="Bold" className="p-1.5 rounded hover:bg-gray-200 text-gray-600 font-bold">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => wrapTag('i', field)} title="Italic" className="p-1.5 rounded hover:bg-gray-200 text-gray-600 italic">
          <Italic size={16} />
        </button>
        <span className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => wrapTag('p', field)} title="New Paragraph" className="p-1.5 rounded hover:bg-gray-200 text-gray-600">
          <Code size={16} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Page Content</h1>

      {message && (
        <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
          {message}
        </div>
      )}

      {preview && (
        <div className="mb-4 bg-white rounded-lg border border-gray-200 p-6" onClick={() => setPreview(null)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
            <button className="text-xs text-gray-400 hover:text-gray-600">Close</button>
          </div>
          <div className="text-sm leading-relaxed space-y-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-800 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-800 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_strong]:font-bold [&_em]:italic" dangerouslySetInnerHTML={{ __html: preview }} />
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
              <Toolbar field="about" />
              <textarea
                ref={aboutRef}
                rows={12}
                value={about.content}
                onChange={(e) => setAbout((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-b-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/50 text-gray-700 resize-y font-mono"
                placeholder="Write about your store, mission, team... Use the toolbar above to format text."
              />
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setPreview(about.content)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#d4869c]"
                >
                  <Eye size={14} /> Preview
                </button>
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
              <Toolbar field="returns" />
              <textarea
                ref={returnsRef}
                rows={12}
                value={returns.content}
                onChange={(e) => setReturns((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-b-md text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/50 text-gray-700 resize-y font-mono"
                placeholder="Write your returns policy, conditions, process... Use the toolbar above to format text."
              />
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setPreview(returns.content)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#d4869c]"
                >
                  <Eye size={14} /> Preview
                </button>
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
      </div>
    </div>
  )
}
