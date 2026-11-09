import {Link} from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link to="/" className="font-bold tracking-tight text-slate-900">
          commerce<span className="text-indigo-600">.</span>
        </Link>
        <p>Quality finds for everyday living.</p>
        <p>© {new Date().getFullYear()} Commerce Store. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
