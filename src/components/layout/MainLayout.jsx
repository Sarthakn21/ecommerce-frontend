import {Outlet} from 'react-router-dom'
import Footer from './Footer.jsx'
import Navbar from "./Navbar.jsx";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
