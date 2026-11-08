import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-sm font-semibold text-indigo-600">404 error</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Page not found</h1>
      <p className="mt-3 text-sm text-slate-500">The page you are looking for does not exist or may have moved.</p>
      <Link to="/" className="mt-7 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
        Return home
      </Link>
    </section>
  )
}

export default NotFound
