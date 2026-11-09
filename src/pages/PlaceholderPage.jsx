import {ArrowLeft} from 'lucide-react'
import {Link} from 'react-router-dom'

function PlaceholderPage({ title, description }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">Coming next</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        <ArrowLeft size={16} /> Back to home
      </Link>
    </section>
  )
}

export default PlaceholderPage
