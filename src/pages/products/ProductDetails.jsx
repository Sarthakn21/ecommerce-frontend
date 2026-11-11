import { useEffect, useState } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle2, Package, ShoppingBag, Star } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getProductById } from '../../services/productService'
import { addCartItem } from '../../services/cartService'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(price ?? 0)

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProduct() {
      setLoading(true)
      setError('')
      setImageFailed(false)

      try {
        const result = await getProductById(id, { signal: controller.signal })
        setProduct(result)
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError.response?.status === 404
            ? 'This product may have been removed or is no longer available.'
            : 'We could not load this product. Check that the backend is running and try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadProduct()
    return () => controller.abort()
  }, [id])

  const handleAddToCart = async () => {
    try {
      setAdding(true)
      await addCartItem(product.id, 1)
      toast.success('Added to cart.')
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        toast.error('Please log in to add products to your cart.')
        navigate('/login', {state: {from: location}, replace: false})
      } else {
        toast.error(requestError.response?.data?.message || 'Unable to add this product to your cart.')
      }
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl animate-pulse px-5 py-12 sm:px-8">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-slate-200" />
          <div className="space-y-5 py-5">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-9 w-3/4 rounded bg-slate-200" />
            <div className="h-6 w-1/3 rounded bg-slate-200" />
            <div className="h-24 rounded bg-slate-200" />
          </div>
        </div>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
        <AlertCircle size={30} className="text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-950">Product unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">{error || 'We could not find this product.'}</p>
        <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
          <ArrowLeft size={16} /> Back to products
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600">
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="mt-7 grid items-start gap-8 md:grid-cols-2 md:gap-14">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {product.imageUrl && !imageFailed ? (
            <img src={product.imageUrl} alt={product.name} onError={() => setImageFailed(true)} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-cyan-50">
              <span className="text-7xl font-semibold text-indigo-200">{product.name?.charAt(0)?.toUpperCase() || 'P'}</span>
            </div>
          )}
        </div>

        <div className="py-2 md:py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">{product.category || 'General'}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              {Number(product.averageRating || 0).toFixed(1)}
              <span className="text-slate-400">({product.reviewCount || 0} reviews)</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          <p className="mt-6 text-3xl font-bold tracking-tight text-slate-950">{formatPrice(product.price)}</p>
          <div className="my-7 h-px bg-slate-200" />
          <h2 className="text-sm font-semibold text-slate-900">Product description</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{product.description || 'No description has been provided for this product.'}</p>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            <ShoppingBag size={17} />
            {adding ? 'Adding...' : product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          </button>

          <div className="mt-8 grid gap-3 rounded-2xl bg-slate-100/80 p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Package size={19} className="text-indigo-600" />
              <div>
                <p className="text-xs text-slate-500">Availability</p>
                <p className="text-sm font-semibold text-slate-800">{product.stock > 0 ? `${product.stock} available` : 'Currently unavailable'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={19} className="text-indigo-600" />
              <div>
                <p className="text-xs text-slate-500">Shopping</p>
                <p className="text-sm font-semibold text-slate-800">Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
