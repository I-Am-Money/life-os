'use client'
import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import LandingHero from '@/components/LandingHero'
import AuthPage from '@/components/AuthPage'
import Dashboard from '@/components/Dashboard'
import FutureSimulator from '@/components/features/FutureSimulator'
import RealityScanner from '@/components/features/RealityScanner'
import DecisionEngine from '@/components/features/DecisionEngine'
import './page.css'

export default function Home() {
  const [view, setView] = useState('home')
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const session = JSON.parse(localStorage.getItem('lifeos_session') || 'null')
      if (session) setUser(session)
    } catch {}
  }, [])

  if (!mounted) return null

  // Auth page
  if (view === 'auth') {
    return (
      <AuthPage
        onSuccess={(u) => { setUser(u); setView('dashboard') }}
        onBack={() => setView('home')}
      />
    )
  }

  // Dashboard (requires login)
  if (view === 'dashboard' && user) {
    return (
      <>
        <NavBar view={view} setView={setView} user={user} />
        <Dashboard user={user} onLogout={() => { setUser(null); setView('home') }} setView={setView} />
      </>
    )
  }

  return (
    <div className="app">
      <NavBar view={view} setView={setView} user={user} onAuthClick={() => setView('auth')} />
      <main className="app-main">
        {view === 'home'      && <LandingHero setView={setView} user={user} />}
        {view === 'simulator' && <FutureSimulator />}
        {view === 'scanner'   && <RealityScanner />}
        {view === 'decisions' && <DecisionEngine />}
      </main>
    </div>
  )
}
