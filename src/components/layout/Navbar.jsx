import {useState} from 'react'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import {LogOut, ShoppingBag, UserRound} from 'lucide-react'
import toast from 'react-hot-toast'
import {useAuth} from '../../context/useAuth'

const navLinkClass = ({ isActive }) =>
  'text-sm font-medium transition-colors hover:text-indigo-600 ' + (isActive ? 'text-indigo-600' : 'text-slate-600')

function Navbar() {
  const {user, loading, logout} = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await logout()
      toast.success('Logged out successfully.')
    } catch {
      toast.error('Unable to contact the server. Your local session has been cleared.')
    } finally {
      setLoggingOut(false)
      navigate('/', {replace: true})
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to={user?.role === 'SELLER' ? '/seller/dashboard' : '/'} className="text-xl font-extrabold tracking-tight text-slate-950">
          commerce<span className="text-indigo-600">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {user?.role !== 'SELLER' && <>
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Shop</NavLink>
          </>}
          {!loading && user?.role === 'USER' && <NavLink to="/orders" className={navLinkClass}>My Orders</NavLink>}
          {!loading && user?.role === 'SELLER' && <NavLink to="/seller/dashboard" className={navLinkClass}>Seller Dashboard</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          {!loading && (
            user ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={19} strokeWidth={1.8} />
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Account"
                className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <UserRound size={20} strokeWidth={1.8} />
              </Link>
            )
          )}
          {(!user || user?.role === 'USER') && (
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
