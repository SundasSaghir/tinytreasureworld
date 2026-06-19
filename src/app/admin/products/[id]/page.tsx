'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, X } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface ProductForm {
  name: string
  category: string
  description: string
  price: string
  salePrice: string
  stock: string
  sku: string
  featured: boolean
  bestSeller: boolean
  status: string
  images: string[]
}

export default function AdminProductFormPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<ProductForm>({
    name: '',
    category: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '',
    sku: '',
    featured: true,
    bestSeller: false,
    status: 'active',
    images: [],
  })
  useEffect(() => {
    async function init() {
      try {
        const catRes = await fetch('/api/categories')
        if (catRes.ok) {
          const cats = await catRes.json()
          setCategories(cats)
          if (cats.length > 0 && isNew) {
            setForm((prev) => ({ ...prev, category: cats[0].name }))
          }
        }

        if (!isNew) {
          const prodRes = await fetch(`/api/products/${params.id}`)
          if (prodRes.ok) {
            const product = await prodRes.json()
            setForm({
              name: product.name || '',
              category: product.category || '',
              description: product.description || '',
              price: product.price?.toString() || '',
              salePrice: product.salePrice?.toString() || '',
              stock: product.stock?.toString() || '',
              sku: product.sku || '',
              featured: product.featured || false,
              bestSeller: product.bestSeller || false,
              status: product.status || 'active',
              images: product.images || [],
            })
          }
        }
      } catch {}
      setLoading(false)
    }
    init()
  }, [isNew, params.id])

  function generateSku(name: string, category: string): string {
    if (!name) return ''
    const catPrefix = category ? category.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3) : 'GEN'
    const namePart = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4)
    const rand = Math.floor(1000 + Math.random() * 9000)
    return `${catPrefix}-${namePart}-${rand}`
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm((prev) => {
        const updated = { ...prev, [name]: value }
        if (isNew && name === 'name' && !prev.sku) {
          updated.sku = generateSku(value, prev.category)
        }
        if (isNew && name === 'category' && prev.name && !prev.sku) {
          updated.sku = generateSku(prev.name, value)
        }
        return updated
      })
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const data = await res.json()
        setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }))
      } else {
        setError('Image upload failed. Make sure you are logged in.')
      }
    } catch {
      setError('Image upload failed. Please try again.')
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock),
        sku: form.sku,
        featured: form.featured,
        bestSeller: form.bestSeller,
        status: form.status,
        images: form.images,
      }

      const url = isNew ? '/api/products' : `/api/products/${params.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save product')
      }
    } catch {
      setError('An error occurred while saving')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-[#d4869c] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'Add New Product' : 'Edit Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
              <input
                type="number"
                name="salePrice"
                value={form.salePrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU (auto-generated)</label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="accent-[#d4869c]"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="bestSeller"
                checked={form.bestSeller}
                onChange={handleChange}
                className="accent-[#d4869c]"
              />
              Best Seller
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4869c] focus:border-transparent text-gray-700"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#f5ede0] file:text-[#d4869c] hover:file:bg-[#f0d6de] disabled:opacity-50"
            />
            {uploading && <p className="text-xs text-[#d4869c] mt-1">Uploading image...</p>}
          </div>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-md">
          {error}
        </div>
      )}

      <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 -mb-6 px-6 py-4 mt-8 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-2 bg-[#d4869c] hover:bg-[#c07088] text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm"
        >
          <Save size={16} />
          {saving || uploading ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
        </button>
        <Link
          href="/admin/products"
          className="px-6 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
      </div>
      </form>
    </div>
  )
}
