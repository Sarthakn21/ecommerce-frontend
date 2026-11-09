import { Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Home from '../pages/home/Home'
import NotFound from '../pages/NotFound'
import PlaceholderPage from '../pages/PlaceholderPage'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={<PlaceholderPage title="Product catalogue" description="The product listing and filters will be implemented next." />}
        />
        <Route
          path="/cart"
          element={<PlaceholderPage title="Your cart" description="Your shopping cart will be available here." />}
        />
        <Route
          path="/login"
          element={<PlaceholderPage title="Welcome back" description="Sign-in and account functionality will be implemented in the authentication step." />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
