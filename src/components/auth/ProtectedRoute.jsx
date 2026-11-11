import {Navigate, useLocation} from 'react-router-dom'
import {useAuth} from '../../context/useAuth'

function ProtectedRoute({ children }) {
  const {user, loading} = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-5">
        <p className="text-sm text-slate-500">Checking your account...</p>
      </section>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{from: location}} replace />
  }

  return children
}

export default ProtectedRoute
