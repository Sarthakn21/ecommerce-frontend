import {useEffect, useState} from 'react'
import {AlertCircle, Package, ShoppingBag, Clock3, CheckCircle2} from 'lucide-react'
import {Link} from 'react-router-dom'
import SellerNavigation from '../../components/seller/SellerNavigation'
import {getSellerProducts} from '../../services/productService'
import {getSellerOrders} from '../../services/orderService'

function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')
        const [productData, orderData] = await Promise.all([getSellerProducts(), getSellerOrders()])
        if (active) {
          setProducts(Array.isArray(productData) ? productData : [])
          setOrders(Array.isArray(orderData) ? orderData : [])
        }
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Unable to load seller dashboard.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadDashboard()
    return () => { active = false }
  }, [])

  const items = orders.flatMap(order => order.items || [])
  const pending = items.filter(item => ['PLACED', 'CONFIRMED', 'PROCESSING'].includes(item.status)).length
  const delivered = items.filter(item => item.status === 'DELIVERED').length
  const stats = [
    {label: 'Total products', value: products.length, icon: Package, note: 'Products in your catalogue'},
    {label: 'Orders', value: orders.length, icon: ShoppingBag, note: 'Orders containing your products'},
    {label: 'Needs attention', value: pending, icon: Clock3, note: 'Items awaiting fulfilment'},
    {label: 'Delivered items', value: delivered, icon: CheckCircle2, note: 'Successfully delivered'},
  ]

  return (
    <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Seller workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Manage your catalogue and fulfil customer orders.</p>
      </div>
      <SellerNavigation />

      {error && (
        <div role="alert" className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">Loading your dashboard...</p>
      ) : (
        <>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({label, value, icon: Icon, note}) => (
              <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{label}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={19} /></span>
                </div>
                <p className="mt-5 text-3xl font-bold tabular-nums text-slate-950">{value}</p>
                <p className="mt-1 text-xs text-slate-400">{note}</p>
              </article>
            ))}
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-950">Product catalogue</h2>
              <p className="mt-2 text-sm text-slate-500">You currently have {products.length} products listed in your seller account.</p>
              <Link to="/seller/products" className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Manage products</Link>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-semibold text-slate-950">Order management</h2>
              <p className="mt-2 text-sm text-slate-500">{pending} order items currently need fulfilment attention.</p>
              <Link to="/seller/orders" className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">View orders</Link>
            </article>
          </div>
        </>
      )}
    </section>
  )
}

export default SellerDashboard
