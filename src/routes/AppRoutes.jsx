import {Route, Routes} from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import Home from '../pages/home/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import NotFound from '../pages/NotFound.jsx'
import Cart from '../pages/cart/Cart'
import OrderConfirmation from '../pages/orders/OrderConfirmation'
import OrderDetails from '../pages/orders/OrderDetails'
import OrderHistory from '../pages/orders/OrderHistory'
import ProductDetails from '../pages/products/ProductDetails'
import ProductList from '../pages/products/ProductList'
import SellerDashboard from '../pages/seller/SellerDashboard'
import SellerProducts from '../pages/seller/SellerProducts'
import SellerOrders from '../pages/seller/SellerOrders'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={<ProtectedRoute allowedRoles={['USER', 'SELLER']}><Cart /></ProtectedRoute>}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute allowedRoles={['USER']}><OrderHistory /></ProtectedRoute>}
        />
        <Route
          path="/orders/:orderId/confirmation"
          element={<ProtectedRoute allowedRoles={['USER']}><OrderConfirmation /></ProtectedRoute>}
        />
        <Route
          path="/orders/:orderId"
          element={<ProtectedRoute allowedRoles={['USER']}><OrderDetails /></ProtectedRoute>}
        />
        <Route path="/seller" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerDashboard /></ProtectedRoute>} />
        <Route path="/seller/dashboard" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerDashboard /></ProtectedRoute>} />
        <Route path="/seller/products" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerProducts /></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerOrders /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
