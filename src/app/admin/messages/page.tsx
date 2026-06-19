'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, Phone, User, MessageSquare, Calendar } from 'lucide-react'

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

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-5">Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No messages yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelected(msg)}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                    selected?.id === msg.id ? 'bg-[#f0d6de]/30' : ''
                  }`}
                >
                  <p className="font-medium text-sm text-gray-700 truncate">{msg.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Message Details</h2>
                <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-md hover:bg-red-100 transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="text-sm font-medium text-gray-700">{selected.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm text-gray-700">{selected.email}</p>
                  </div>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm text-gray-700">{selected.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm text-gray-700">{new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Message</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              {messages.length > 0 ? 'Select a message to view' : 'No messages to display'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
