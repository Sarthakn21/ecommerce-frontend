import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

const benefits = [
  { icon: Truck, title: 'Reliable delivery', description: 'Get your orders delivered to your doorstep.' },
  { icon: ShieldCheck, title: 'Secure checkout', description: 'A smooth and secure shopping experience.' },
  { icon: RefreshCw, title: 'Easy returns', description: 'Shop confidently with a simple return process.' },
]

function Home() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-7 py-14 text-white sm:px-14 sm:py-20 lg:px-20">
          <div className="absolute -right-20 -top-28 -z-10 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 -z-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">
              Your everyday marketplace
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Find something
              <span className="block text-indigo-300">worth loving.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Explore a thoughtful collection of everyday essentials and discover products that make life a little better.
            </p>
            <Link
              to="/products"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-indigo-100"
            >
              Explore products <ArrowRight size={17} />
            </Link>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[38%] items-center justify-center lg:flex">
            <div className="relative h-72 w-72">
              <div className="absolute inset-5 rotate-[-12deg] rounded-[2.5rem] border border-white/20 bg-white/5 backdrop-blur-sm" />
              <div className="absolute inset-10 rotate-[9deg] rounded-[2.5rem] border border-indigo-200/30 bg-gradient-to-br from-indigo-400/40 to-cyan-300/10 shadow-2xl" />
              <div className="absolute inset-x-0 bottom-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">Discover more</p>
                <p className="mt-2 text-2xl font-semibold">Good finds. Great days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">The experience</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Shopping made simple</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:inline-flex">
            Browse all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
