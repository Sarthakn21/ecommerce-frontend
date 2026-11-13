import {useCallback, useEffect, useState} from 'react'
import {ArrowRight, Package, ShoppingBag} from 'lucide-react'
import {Link} from 'react-router-dom'
import {getMyOrders} from '../../services/orderService'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(price ?? 0)

const formatDate = (date) =>
  date ? new Date(date).toLocaleString('en-IN', {dateStyle: 'medium', timeStyle: 'short'}) : '—'

const statusClass = (status) => {
  if (status === 'DELIVERED') return 'bg-emerald-50 text-emerald-700'
  if (status === 'CANCELLED') return 'bg-red-50 text-red-700'
  if (status === 'SHIPPED') return 'bg-sky-50 text-sky-700'
  return 'bg-indigo-50 text-indigo-700'
}

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const result = await getMyOrders()
      setOrders(result)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center px-5">
        <p className="text-sm text-slate-500">Loading your orders...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button type="button" onClick={loadOrders} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">
          Try again
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Your account</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">My Orders</h1>
        <p className="mt-2 text-sm text-slate-500">Track and review your recent purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-9 rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <ShoppingBag size={36} className="mx-auto text-slate-400" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">No orders yet</h2>
          <p className="mt-2 text-sm text-slate-500">Your placed orders will appear here.</p>
          <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Start shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article key={order.orderId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="shrink-0 text-indigo-600" />
                    <p className="text-sm font-semibold text-slate-950">Order #{order.orderId}</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span className={'w-fit rounded-full px-3 py-1 text-xs font-semibold ' + statusClass(order.status)}>
                  {order.status}
                </span>
              </div>

              <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs text-slate-500">{order.items?.length || 0} different products</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">{formatPrice(order.total)}</p>
                </div>
                <Link to={'/orders/' + order.orderId} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700">
                  View details <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default OrderHistory
