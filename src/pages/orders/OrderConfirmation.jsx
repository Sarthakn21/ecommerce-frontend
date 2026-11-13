import {useEffect, useState} from 'react'
import {CheckCircle2, Package, ShoppingBag} from 'lucide-react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {getOrderById} from '../../services/orderService'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(price ?? 0)

const formatDate = (date) =>
  date ? new Date(date).toLocaleString('en-IN', {dateStyle: 'medium', timeStyle: 'short'}) : '—'

function OrderConfirmation() {
  const {orderId} = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState('')

  useEffect(() => {
    if (order) return

    let active = true

    getOrderById(orderId)
      .then((result) => {
        if (active) setOrder(result)
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || 'Unable to load this order.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [order, orderId])

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-5">
        <p className="text-sm text-slate-500">Loading your order...</p>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <p className="text-sm text-red-600">{error || 'Order not found.'}</p>
        <Link to="/orders" className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          View my orders
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <CheckCircle2 size={54} className="mx-auto text-emerald-600" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Order placed</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Thank you for your order!</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your order has been placed successfully. You can view its status and details anytime from My Orders.
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5 text-left">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">Order ID</span>
            <span className="break-all text-right font-semibold text-slate-900">{order.orderId}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Order date</span>
            <span className="font-medium text-slate-900">{formatDate(order.createdAt)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Status</span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{order.status}</span>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between font-semibold text-slate-950">
              <span>Order total</span>
              <span className="text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={'/orders/' + order.orderId} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
            <Package size={17} /> View order details
          </Link>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <ShoppingBag size={17} /> Continue shopping
          </Link>
        </div>
      </div>
    </section>
  )
}

export default OrderConfirmation
