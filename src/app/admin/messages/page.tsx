'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, Phone, User, MessageSquare, Calendar, ChevronRight, Inbox, Search } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)
  const [search, setSearch] = useState('')

  async function fetchMessages() {
    setLoading(true)
    try {
      const res = await fetch('/api/messages')
      if (res.ok) setMessages(await res.json())
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    try {
      const res = await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        if (selected?.id === id) setSelected(null)
      }
    } catch {}
  }

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#4a3730]">Messages</h1>
          <p className="text-xs text-[#8a7a6e] mt-0.5">{messages.length} total messages</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d4869c]/30 text-gray-700"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-[#d4869c] border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-gray-400 mt-3">Loading messages...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Inbox size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">{search ? 'No messages match your search' : 'No messages yet'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`p-4 cursor-pointer transition-colors ${
                  selected?.id === msg.id ? 'bg-[#f0d6de]/20' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-7 h-7 rounded-full bg-[#f5ede0] flex items-center justify-center text-xs font-semibold text-[#d48e66] flex-shrink-0">
                        {msg.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-semibold text-sm text-[#4a3730] truncate">{msg.name}</span>
                      <span className="text-[10px] text-gray-400 ml-auto flex-shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 ml-9 line-clamp-1">{msg.message}</p>
                    <div className="flex items-center gap-3 ml-9 mt-1.5">
                      {msg.email && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Mail size={10} /> {msg.email}
                        </span>
                      )}
                      {msg.phone && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Phone size={10} /> {msg.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 mt-2 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4" onClick={() => setSelected(null)}>
          <div className="fixed inset-0 bg-black/30" />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#f5ede0] flex items-center justify-center text-sm font-bold text-[#d48e66]">
                  {selected.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h3 className="font-semibold text-[#4a3730] text-sm">{selected.name}</h3>
                  <p className="text-[10px] text-gray-400">{new Date(selected.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(selected.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {selected.email && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${selected.email}`} className="text-sm text-[#d4869c] hover:underline font-medium break-all">
                      {selected.email}
                    </a>
                  </div>
                )}
                {selected.phone && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                    <a href={`tel:${selected.phone}`} className="text-sm text-[#d4869c] hover:underline font-medium">
                      {selected.phone}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-[#6a5a4e] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-3 flex justify-end">
              <button onClick={() => setSelected(null)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
