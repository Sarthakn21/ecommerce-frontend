import { useEffect, useState } from 'react'
import { AlertCircle, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ProductCard from '../../components/products/ProductCard'
import { getProducts } from '../../services/productService'

const PAGE_SIZE = 12

function ProductList() {
  const [products, setProducts] = useState([])
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [filters, setFilters] = useState({ search: '', minPrice: '', maxPrice: '' })
  const [sort, setSort] = useState('price,asc')
  const [page, setPage] = useState(0)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setLoading(true)
      setError('')

      try {
        const result = await getProducts({
          page,
          size: PAGE_SIZE,
          sort,
          search: filters.search,
          minPrice: filters.minPrice === '' ? undefined : Number(filters.minPrice),
          maxPrice: filters.maxPrice === '' ? undefined : Number(filters.maxPrice),
          signal: controller.signal,
        })

        setProducts(Array.isArray(result.data) ? result.data : [])
        setPageInfo({
          page: result.page ?? page,
          totalPages: result.totalPages ?? 0,
          totalElements: result.totalElements ?? 0,
          first: result.first ?? page === 0,
          last: result.last ?? true,
        })
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError('We could not load products. Check that the backend is running and try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [page, sort, filters, retryCount])

  const handleApplyFilters = (event) => {
    event.preventDefault()

    const search = searchInput.trim()
    const minPrice = minPriceInput.trim()
    const maxPrice = maxPriceInput.trim()

    if (search && (minPrice || maxPrice)) {
      toast.error('Use product search or a price range at a time.')
      return
    }

    if ((minPrice && !maxPrice) || (!minPrice && maxPrice)) {
      toast.error('Enter both minimum and maximum prices.')
      return
    }

    if (minPrice && (Number(minPrice) < 0 || Number(maxPrice) < Number(minPrice))) {
      toast.error('Enter a valid price range.')
      return
    }

    setFilters({ search, minPrice, maxPrice })
    setPage(0)
  }

  const handleClearFilters = () => {
    setSearchInput('')
    setMinPriceInput('')
    setMaxPriceInput('')
    setFilters({ search: '', minPrice: '', maxPrice: '' })
    setPage(0)
  }

  const hasActiveFilters = Boolean(filters.search || filters.minPrice || filters.maxPrice)

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">The collection</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Explore products</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Find the right things for your everyday. Browse the collection and discover something new.
          </p>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
          Sort by
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value)
              setPage(0)
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="price,asc">Price: Low to high</option>
            <option value="price,desc">Price: High to low</option>
            <option value="averageRating,desc">Top rated</option>
            <option value="createdAt,desc">Newest</option>
          </select>
        </label>
      </div>

      <form onSubmit={handleApplyFilters} className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <SlidersHorizontal size={17} className="text-indigo-600" />
          Find what you need
        </div>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <label className="relative block">
            <span className="sr-only">Search by product name</span>
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search products by name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <label>
            <span className="sr-only">Minimum price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={minPriceInput}
              onChange={(event) => setMinPriceInput(event.target.value)}
              placeholder="Min price (₹)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <label>
            <span className="sr-only">Maximum price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxPriceInput}
              onChange={(event) => setMaxPriceInput(event.target.value)}
              placeholder="Max price (₹)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="flex flex-1 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Apply
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                aria-label="Clear filters"
                className="flex items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-600 transition hover:bg-slate-50"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Search and price range use separate filters in the current backend API. Apply one at a time.
        </p>
      </form>

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {loading ? 'Loading products…' : `${pageInfo.totalElements} products found`}
        </p>
        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Clear filters
          </button>
        )}
      </div>

      {error && (
        <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Unable to load the catalogue</p>
            <p className="mt-1">{error}</p>
            <button onClick={() => setRetryCount((count) => count + 1)} className="mt-2 font-semibold underline">Retry</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-[4/3] animate-pulse bg-slate-100" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : !error && products.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Search size={20} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No products found</h2>
          <p className="mt-2 text-sm text-slate-500">Try another search or clear your filters.</p>
          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}

      {!loading && !error && pageInfo.totalPages > 1 && (
        <nav aria-label="Product pages" className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={pageInfo.first}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} /> Previous
          </button>
          <span className="text-sm tabular-nums text-slate-500">
            Page {pageInfo.page + 1} of {pageInfo.totalPages}
          </span>
          <button
            disabled={pageInfo.last}
            onClick={() => setPage((current) => current + 1)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={17} />
          </button>
        </nav>
      )}
    </section>
  )
}

export default ProductList
