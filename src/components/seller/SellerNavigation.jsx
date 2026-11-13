import {NavLink} from 'react-router-dom'
import {LayoutDashboard, Package, ShoppingBag} from 'lucide-react'

const links = [
  {to: '/seller/dashboard', label: 'Overview', icon: LayoutDashboard},
  {to: '/seller/products', label: 'My products', icon: Package},
  {to: '/seller/orders', label: 'Orders', icon: ShoppingBag},
]

function SellerNavigation() {
  return (
    <nav aria-label="Seller navigation" className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
      {links.map(({to, label, icon: Icon}) => (
        <NavLink
          key={to}
          to={to}
          className={({isActive}) =>
            'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ' +
            (isActive ? 'bg-slate-950 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default SellerNavigation
