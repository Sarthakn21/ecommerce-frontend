import { ArrowUpRight, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(price ?? 0)

function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage = product.imageUrl && !imageFailed

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {hasImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-cyan-50">
              <span className="text-4xl font-semibold text-indigo-200">
                {product.name?.charAt(0)?.toUpperCase() || 'P'}
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-white">
              Out of stock
            </span>
          )}
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition group-hover:bg-indigo-600 group-hover:text-white">
            <ArrowUpRight size={17} />
          </span>
        </div>

        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
            {product.category || 'General'}
          </p>
          <h2 className="mt-2 line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-slate-900">
            {product.name}
          </h2>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-base font-bold text-slate-950">{formatPrice(product.price)}</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {Number(product.averageRating || 0).toFixed(1)}
              <span className="text-slate-400">({product.reviewCount || 0})</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard
