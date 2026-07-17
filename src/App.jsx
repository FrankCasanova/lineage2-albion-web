import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { MotionConfig, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Rankings from './pages/Rankings'
import About from './pages/About'
import Download from './pages/Download'
import Admin from './pages/Admin'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Lobby />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/about" element={<About />} />
        <Route path="/download" element={<Download />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppLayout() {
  const location = useLocation()
  const isLobby = location.pathname === '/'

  return (
    <div className="relative flex flex-col min-h-screen">
      {!isLobby && <ScrollProgress />}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f1f1f',
            color: '#fff',
            border: '1px solid #2a2a2a',
          },
        }}
      />
      {!isLobby && <Navbar />}
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      {!isLobby && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <MotionConfig reducedMotion="user">
        <AppLayout />
      </MotionConfig>
    </BrowserRouter>
  )
}
