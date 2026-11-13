import {useCallback, useEffect, useState} from 'react'
import {AlertCircle, Edit3, Plus, X} from 'lucide-react'
import toast from 'react-hot-toast'
import SellerNavigation from '../../components/seller/SellerNavigation'
import {createProduct, deactivateProduct, getSellerProducts, updateProduct} from '../../services/productService'

const emptyForm = {name: '', description: '', price: '', category: '', stock: '', imageUrl: ''}
const money = value => new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR', maximumFractionDigits: 2}).format(value ?? 0)

function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const result = await getSellerProducts()
      setProducts(Array.isArray(result) ? result : [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = product => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      stock: String(product.stock ?? ''),
      imageUrl: product.imageUrl || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    }
    try {
      setSaving(true)
      if (editingId) {
        await updateProduct(editingId, payload)
        toast.success('Product updated.')
      } else {
        await createProduct(payload)
        toast.success('Product created.')
      }
      setShowForm(false)
      setForm(emptyForm)
      setEditingId(null)
      await loadProducts()
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to save product.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async product => {
    if (!window.confirm(`Deactivate "${product.name}"? Customers will no longer be able to purchase it.`)) return
    try {
      await deactivateProduct(product.id)
      toast.success('Product deactivated.')
      await loadProducts()
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to deactivate product.')
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Seller workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">My products</h1>
        <p className="mt-2 text-sm text-slate-500">Create, update and manage products in your catalogue.</p>
      </div>
      <SellerNavigation />

      <div className="mt-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500">{products.length} products</p>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
          <Plus size={17} /> Add product
        </button>
      </div>

      {showForm && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">{editingId ? 'Edit product' : 'Add a product'}</h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Product name
              <input required maxLength={120} value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400" />
            </label>
            <label className="text-sm font-medium text-slate-700">Category
              <input required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400" />
            </label>
            <label className="text-sm font-medium text-slate-700">Price (₹)
              <input required type="number" min="0.01" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400" />
            </label>
            <label className="text-sm font-medium text-slate-700">Available stock
              <input required type="number" min="0" step="1" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400" />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Image URL
              <input type="url" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400" />
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Description
              <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none focus:border-indigo-400" />
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button disabled={saving} className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create product'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {error && <div role="alert" className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} />{error}<button onClick={loadProducts} className="ml-auto font-semibold underline">Retry</button></div>}

      {loading ? <p className="py-16 text-center text-sm text-slate-500">Loading products...</p> : products.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <h2 className="font-semibold text-slate-900">No products yet</h2>
          <p className="mt-2 text-sm text-slate-500">Add your first product to start selling.</p>
          <button onClick={openCreate} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">Add product</button>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-5 py-4"><p className="font-semibold text-slate-900">{product.name}</p><p className="mt-1 text-xs text-slate-400">{product.category}</p></td>
                    <td className="px-5 py-4 font-medium text-slate-800">{money(product.price)}</td>
                    <td className="px-5 py-4 text-slate-600">{product.stock}</td>
                    <td className="px-5 py-4"><span className={'rounded-full px-2.5 py-1 text-xs font-semibold ' + (product.active === false ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700')}>{product.active === false ? 'Inactive' : 'Active'}</span></td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(product)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"><Edit3 size={14} /> Edit</button>
                      {product.active !== false && <button onClick={() => handleDeactivate(product)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">Deactivate</button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

export default SellerProducts
