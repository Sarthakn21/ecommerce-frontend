import {useCallback, useEffect, useState} from 'react'
import {AlertCircle, PackageCheck, RefreshCw} from 'lucide-react'
import toast from 'react-hot-toast'
import SellerNavigation from '../../components/seller/SellerNavigation'
import {getSellerOrders, updateSellerOrderItemStatus} from '../../services/orderService'

const money = value => new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'INR', maximumFractionDigits: 2}).format(value ?? 0)
const date = value => value ? new Date(value).toLocaleString('en-IN', {dateStyle: 'medium', timeStyle: 'short'}) : '—'
const badge = status => {
  if (status === 'DELIVERED') return 'bg-emerald-50 text-emerald-700'
  if (status === 'CANCELLED') return 'bg-red-50 text-red-700'
  if (status === 'SHIPPED') return 'bg-sky-50 text-sky-700'
  return 'bg-indigo-50 text-indigo-700'
}
const nextActions = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState('')
  const [reasons, setReasons] = useState({})

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const result = await getSellerOrders()
      setOrders(Array.isArray(result) ? result : [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your orders.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadOrders() }, [loadOrders])

  const handleStatus = async (order, item, status) => {
    const key = `${order.orderId}-${item.itemId}`
    const reason = reasons[key]?.trim()
    if (status === 'CANCELLED' && !reason) {
      toast.error('Enter a cancellation reason before cancelling this item.')
      return
    }
    try {
      setUpdating(key)
      const updated = await updateSellerOrderItemStatus(order.orderId, item.itemId, status, status === 'CANCELLED' ? reason : undefined)
      setOrders(current => current.map(existing => existing.orderId === updated.orderId ? updated : existing))
      if (status === 'CANCELLED') setReasons(current => ({...current, [key]: ''}))
      toast.success(`Item status updated to ${status.toLowerCase()}.`)
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to update item status.')
    } finally {
      setUpdating('')
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Seller workspace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Customer orders</h1>
        <p className="mt-2 text-sm text-slate-500">Manage fulfilment for only the products you sold in each order.</p>
      </div>
      <SellerNavigation />

      <div className="mt-7 flex items-center justify-between">
        <p className="text-sm text-slate-500">{orders.length} orders found</p>
        <button onClick={loadOrders} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={15} /> Refresh</button>
      </div>

      {error && <div role="alert" className="mt-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} />{error}<button onClick={loadOrders} className="ml-auto font-semibold underline">Retry</button></div>}

      {loading ? <p className="py-16 text-center text-sm text-slate-500">Loading orders...</p> : orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <PackageCheck size={28} className="mx-auto text-slate-400" />
          <h2 className="mt-4 font-semibold text-slate-900">No orders yet</h2>
          <p className="mt-2 text-sm text-slate-500">Orders containing your products will appear here.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {orders.map(order => (
            <article key={order.orderId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center">
                <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Order</p><h2 className="mt-1 break-all font-bold text-slate-950">#{order.orderId}</h2><p className="mt-1 text-xs text-slate-500">Placed {date(order.createdAt)} · Customer {order.customerId}</p></div>
                <span className={'w-fit rounded-full px-3 py-1.5 text-xs font-semibold ' + badge(order.status)}>{order.status?.replaceAll('_', ' ')}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {order.items?.map(item => {
                  const key = `${order.orderId}-${item.itemId}`
                  const actions = nextActions[item.status] || []
                  return (
                    <div key={item.itemId} className="p-5">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div><h3 className="font-semibold text-slate-900">{item.productName}</h3><p className="mt-1 text-sm text-slate-500">Qty {item.quantity} · {money(item.price)} each · Subtotal {money(item.subtotal)}</p>{item.cancellationReason && <p className="mt-2 text-xs text-red-600">Cancellation reason: {item.cancellationReason}</p>}</div>
                        <span className={'w-fit rounded-full px-3 py-1.5 text-xs font-semibold ' + badge(item.status)}>{item.status?.replaceAll('_', ' ')}</span>
                      </div>
                      {actions.length > 0 && (
                        <div className="mt-4 flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
                          {actions.includes('CANCELLED') && <label className="text-xs font-semibold text-slate-600">Cancellation reason
                            <input value={reasons[key] || ''} onChange={event => setReasons(current => ({...current, [key]: event.target.value}))} placeholder="e.g. Product currently unavailable" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-indigo-400" />
                          </label>}
                          <div className="flex flex-wrap gap-2">
                            {actions.map(status => (
                              <button key={status} disabled={updating === key} onClick={() => handleStatus(order, item, status)} className={'rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ' + (status === 'CANCELLED' ? 'border border-red-200 bg-white text-red-700 hover:bg-red-50' : 'bg-slate-950 text-white hover:bg-indigo-700')}>
                                {updating === key ? 'Updating...' : status === 'CANCELLED' ? 'Cancel item' : status === 'CONFIRMED' ? 'Confirm item' : status === 'PROCESSING' ? 'Start processing' : status === 'SHIPPED' ? 'Mark shipped' : 'Mark delivered'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SellerOrders
