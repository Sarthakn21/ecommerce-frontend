import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'
import {useAuth} from '../../context/useAuth'

function Register() {
  const {register} = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [storeName, setStoreName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }

    if (role === 'SELLER' && !storeName.trim()) {
      toast.error('Please enter your store name.')
      return
    }

    const userData = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      storeName: role === 'SELLER' ? storeName.trim() : null,
    }

    try {
      setSubmitting(true)
      await register(userData)
      toast.success('Account created successfully. Please sign in.')
      navigate('/login', {replace: true})
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create your account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Get started
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join us and start shopping.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="register-email"
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
            <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">
              Account type
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="USER">Customer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>

          {role === 'SELLER' && (
            <div>
              <label htmlFor="store-name" className="mb-2 block text-sm font-medium text-slate-700">
                Store name
              </label>
              <input
                id="store-name"
                type="text"
                required
                value={storeName}
                onChange={(event) => setStoreName(event.target.value)}
                placeholder="Your store name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Register
