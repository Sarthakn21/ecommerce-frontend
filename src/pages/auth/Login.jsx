import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'
import {useAuth} from '../../context/useAuth'

function Login() {
  const {user, loading, login} = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      navigate('/', {replace: true})
    }
  }, [loading, user, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error('Please enter your email and password.')
      return
    }

    try {
      setSubmitting(true)
      await login({email: email.trim(), password})
      toast.success('Login successful.')
      navigate('/', {replace: true})
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to log in. Please check your credentials.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-5">
        <p className="text-sm text-slate-500">Checking your account...</p>
      </section>
    )
  }

  if (user) {
    return null
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your details to continue shopping.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
