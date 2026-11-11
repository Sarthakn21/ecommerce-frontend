import {useEffect, useState} from 'react'
import {ArrowLeft, Minus, Plus, ShoppingBag, Trash2} from 'lucide-react'
import toast from 'react-hot-toast'
import {Link} from 'react-router-dom'
import {clearCart, getCart, removeCartItem, updateCartItem} from '../../services/cartService'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(price ?? 0)

function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingProductId, setUpdatingProductId] = useState('')
  const [clearing, setClearing] = useState(false)
  const [error, setError] = useState('')

  const loadCart = async () => {
    try {
      setError('')
      const result = await getCart()
      setCart(result)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const handleQuantityChange = async (item, quantity) => {
    if (quantity < 1) return

    try {
      setUpdatingProductId(item.productId)
      const updatedCart = await updateCartItem(item.productId, quantity)
      setCart(updatedCart)
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to update the quantity.')
    } finally {
      setUpdatingProductId('')
    }
  }

  const handleRemove = async (productId) => {
    try {
      setUpdatingProductId(productId)
      const updatedCart = await removeCartItem(productId)
      setCart(updatedCart)
      toast.success('Product removed from your cart.')
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to remove this product.')
    } finally {
      setUpdatingProductId('')
    }
  }

  const handleClearCart = async () => {
    try {
      setClearing(true)
      await clearCart()
      setCart((currentCart) => ({...currentCart, items: [], total: 0}))
      toast.success('Your cart has been cleared.')
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to clear your cart.')
    } finally {
      setClearing(false)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-5">
        <p className="text-sm text-slate-500">Loading your cart...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={loadCart} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">
          Try again
        </button>
      </section>
    )
  }

  const items = cart?.items || []

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Your selection</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Shopping cart</h1>
          <p className="mt-2 text-sm text-slate-500">{items.length} {items.length === 1 ? 'product' : 'products'} in your cart</p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            disabled={clearing || Boolean(updatingProductId)}
            className="text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:opacity-50"
          >
            {clearing ? 'Clearing...' : 'Clear cart'}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <ShoppingBag size={34} className="mx-auto text-slate-400" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-500">Explore our collection and add something you like.</p>
          <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
            <ArrowLeft size={16} /> Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.productId} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <Link to={`/products/${item.productId}`} className="font-semibold text-slate-900 transition hover:text-indigo-600">
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">{formatPrice(item.price)} each</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">Subtotal: {formatPrice(item.subtotal)}</p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-3 rounded-full border border-slate-200 px-2 py-1">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.productName}`}
                      disabled={updatingProductId === item.productId || item.quantity <= 1}
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="min-w-5 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.productName}`}
                      disabled={Boolean(updatingProductId)}
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.productName}`}
                    disabled={Boolean(updatingProductId)}
                    onClick={() => handleRemove(item.productId)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-950">Order summary</h2>
            <div className="mt-5 flex justify-between text-sm text-slate-600">
              <span>Items ({items.length})</span>
              <span>{formatPrice(cart?.total)}</span>
            </div>
            <div className="my-5 h-px bg-slate-200" />
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-950">Total</span>
              <span className="text-xl font-bold text-slate-950">{formatPrice(cart?.total)}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">Shipping and checkout will be available when we implement the order flow.</p>
            <button type="button" disabled className="mt-6 w-full cursor-not-allowed rounded-full bg-slate-300 px-5 py-3 text-sm font-semibold text-white">
              Proceed to checkout
            </button>
            <Link to="/products" className="mt-4 block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}

export default Cart
