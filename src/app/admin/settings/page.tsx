'use client'

import { useState, useEffect } from 'react'
import { Save, Clock, Globe, Camera, Music2, ToggleLeft } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([])
  const [flashSaleEnabled, setFlashSaleEnabled] = useState(false)
  const [flashSaleEnd, setFlashSaleEnd] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: any[]) => {
        setSettings(data)
        const getVal = (key: string) => data.find((s: any) => s.key === key)?.value || ''
        setFlashSaleEnabled(getVal('flash_sale_enabled') === 'true')
        setFlashSaleEnd(getVal('flash_sale_end'))
        setWhatsapp(getVal('whatsapp_number'))
        setEmail(getVal('email'))
        setAddress(getVal('address'))
        setFacebookUrl(getVal('facebook_url'))
        setInstagramUrl(getVal('instagram_url'))
        setTiktokUrl(getVal('tiktok_url'))
      })
  }, [])

  async function saveSetting(key: string, value: string) {
    await fetch('/api/settings/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
  }

  async function handleSave() {
    setSaving(true)
    setMsg('')
    await saveSetting('flash_sale_enabled', flashSaleEnabled ? 'true' : 'false')
    await saveSetting('flash_sale_end', flashSaleEnd)
    await saveSetting('whatsapp_number', whatsapp)
    await saveSetting('email', email)
    await saveSetting('address', address)
    await saveSetting('facebook_url', facebookUrl)
    await saveSetting('instagram_url', instagramUrl)
    await saveSetting('tiktok_url', tiktokUrl)
    setSaving(false)
    setMsg('Settings saved!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#4a3730] mb-6">Settings</h1>

      {msg && (
        <div className="mb-4 px-4 py-3 bg-[#f0d6de] text-[#4a3730] rounded-lg text-sm font-medium">
          {msg}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#f0e6d8] p-6 space-y-6">
        {/* Flash Sale */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#4a3730]">
              <Clock size={16} className="text-[#d48e66]" />
              Flash Sale
            </label>
            <button
              onClick={() => setFlashSaleEnabled(!flashSaleEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                flashSaleEnabled ? 'bg-[#d48e66]' : 'bg-[#e0d4c4]'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  flashSaleEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {flashSaleEnabled && (
            <>
              <p className="text-xs text-[#8a7a6e] mb-2">
                Set a future date/time for the flash sale countdown.
              </p>
              <input
                type="datetime-local"
                value={flashSaleEnd}
                onChange={(e) => setFlashSaleEnd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#f0e6d8] text-sm focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30"
              />
            </>
          )}
        </div>

        <hr className="border-[#f0e6d8]" />

        {/* WhatsApp Number */}
        <div>
          <label className="block text-sm font-semibold text-[#4a3730] mb-1">WhatsApp Number</label>
          <p className="text-xs text-[#8a7a6e] mb-2">With country code, e.g. <strong>+92</strong>3001234567 (without + sign: 923001234567)</p>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#f0e6d8] text-sm focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#4a3730] mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#f0e6d8] text-sm focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-[#4a3730] mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[#f0e6d8] text-sm focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30"
          />
        </div>

        <hr className="border-[#f0e6d8]" />

        {/* Social Media Links */}
        <div>
          <h3 className="text-sm font-semibold text-[#4a3730] mb-3">Social Media Links</h3>

          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[#6a5a4e] mb-1">
                <Globe size={14} className="text-[#1877F2]" />
                Facebook URL
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#f0e6d8] text-sm focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[#6a5a4e] mb-1">
                <Camera size={14} className="text-[#d48e66]" />
                Instagram URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#f0e6d8] text-sm focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[#6a5a4e] mb-1">
                <Music2 size={14} className="text-[#4a3730]" />
                TikTok URL
              </label>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#f0e6d8] text-sm focus:outline-none focus:ring-2 focus:ring-[#d48e66]/30"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#d48e66] text-white font-medium rounded-lg hover:bg-[#c07850] transition-colors disabled:opacity-60"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
