import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, UserRound } from 'lucide-react'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-indigo-600 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-950">
          commerce<span className="text-indigo-600">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>Shop</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            aria-label="Account"
            className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <UserRound size={20} strokeWidth={1.8} />
          </Link>
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
