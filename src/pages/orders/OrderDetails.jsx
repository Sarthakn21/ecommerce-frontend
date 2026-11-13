import {useCallback, useEffect, useState} from 'react'
import {ArrowLeft, Package, XCircle} from 'lucide-react'
import toast from 'react-hot-toast'
import {Link, useParams} from 'react-router-dom'
import {cancelOrder, getOrderById} from '../../services/orderService'

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

function OrderDetails() {
  const {orderId} = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const result = await getOrderById(orderId)
      setOrder(result)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load this order.')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    loadOrder()
  }, [loadOrder])

  const handleCancel = async () => {
    try {
      setCancelling(true)
      const updatedOrder = await cancelOrder(orderId)
      setOrder(updatedOrder)
      toast.success('Your order has been cancelled.')
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to cancel this order.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-5">
        <p className="text-sm text-slate-500">Loading order details...</p>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <p className="text-sm text-red-600">{error || 'Order not found.'}</p>
        <button type="button" onClick={loadOrder} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">
          Try again
        </button>
      </section>
    )
  }

  const canCancel = order.status === 'PLACED' || order.status === 'CONFIRMED'

  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600">
        <ArrowLeft size={16} /> Back to my orders
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Order details</p>
          <h1 className="mt-2 break-all text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Order #{order.orderId}</h1>
          <p className="mt-2 text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={'w-fit rounded-full px-3 py-1.5 text-xs font-semibold ' + statusClass(order.status)}>
          {order.status}
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Package size={19} className="text-indigo-600" />
          <h2 className="font-semibold text-slate-950">Items ordered</h2>
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.productId} className="flex flex-col justify-between gap-2 py-4 first:pt-0 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-slate-900">{item.productName}</p>
                <p className="mt-1 text-sm text-slate-500">{formatPrice(item.price)} each · Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold text-slate-900">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-5">
          <span className="font-semibold text-slate-950">Order total</span>
          <span className="text-xl font-bold text-slate-950">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-semibold text-slate-950">Order information</h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-slate-500">Order status</p>
            <p className="mt-1 font-semibold text-slate-900">{order.status}</p>
          </div>
          <div>
            <p className="text-slate-500">Last updated</p>
            <p className="mt-1 font-semibold text-slate-900">{formatDate(order.updatedAt)}</p>
          </div>
        </div>
      </div>

      {canCancel && (
        <div className="mt-5 flex flex-col justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-900">Need to cancel this order?</p>
            <p className="mt-1 text-xs text-slate-500">Cancellation is available while the order is placed or confirmed.</p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <XCircle size={16} /> {cancelling ? 'Cancelling...' : 'Cancel order'}
          </button>
        </div>
      )}
    </section>
  )
}

export default OrderDetails
