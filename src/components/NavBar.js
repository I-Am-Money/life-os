'use client'
import React, { useState, useEffect } from 'react'
import { Cpu, BarChart2, ScanSearch, GitFork, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'simulator', label: 'Future Simulator', icon: BarChart2 },
  { id: 'scanner',   label: 'Reality Scanner',  icon: ScanSearch },
  { id: 'decisions', label: 'Decision Engine',  icon: GitFork },
]

export default function NavBar({ view, setView, user, onAuthClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
      background: scrolled ? 'rgba(10,10,15,0.96)' : 'rgba(10,10,15,0.7)',
      backdropFilter: 'blur(24px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(249,115,22,0.15)' : 'rgba(249,115,22,0.08)'}`,
      boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.5)' : 'none',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center', padding: '0 28px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #ea580c, #f97316)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 12px rgba(234,88,12,0.4)' }}>
            <Cpu size={15} color="#0a0a0f" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', color: '#f5f0eb' }}>
            Life<span style={{ color: '#f97316' }}>OS</span>
          </span>
        </button>

        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }} className="desktop-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <button key={item.id} onClick={() => setView(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 8,
                background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
                border: `1px solid ${active ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
                color: active ? '#fb923c' : '#a09080',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; e.currentTarget.style.color = '#f5f0eb' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a09080' } }}>
                <Icon size={13} strokeWidth={active ? 2.5 : 2} /> {item.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 100, padding: '4px 11px', letterSpacing: '0.08em', fontWeight: 600 }}>
            <span style={{ width: 5, height: 5, background: '#4ade80', borderRadius: '50%', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            AI LIVE
          </div>

          {user ? (
            <button onClick={() => setView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: view === 'dashboard' ? 'rgba(249,115,22,0.15)' : 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 9, cursor: 'pointer', color: '#fb923c', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, transition: 'all 0.18s' }}>
              <div style={{ width: 20, height: 20, background: 'linear-gradient(135deg, #ea580c, #f97316)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#0a0a0f', fontSize: 9, fontWeight: 700 }}>{user.name?.[0]?.toUpperCase()}</span>
              </div>
              Dashboard
            </button>
          ) : (
            <>
              <button onClick={onAuthClick} style={{ padding: '7px 15px', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 9, background: 'transparent', color: '#a09080', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fb923c'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#a09080'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.25)' }}>
                Sign In
              </button>
              <button onClick={onAuthClick} style={{ padding: '7px 15px', border: 'none', borderRadius: 9, background: '#f97316', color: '#0a0a0f', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 10px rgba(249,115,22,0.35)', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fb923c' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f97316' }}>
                Get Started
              </button>
            </>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f5f0eb', display: 'none' }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ position: 'absolute', top: 64, left: 0, right: 0, background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(249,115,22,0.12)', padding: '14px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => { setView(item.id); setMobileOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: view === item.id ? 'rgba(249,115,22,0.1)' : 'transparent', border: '1px solid rgba(249,115,22,0.1)', borderRadius: 8, color: view === item.id ? '#fb923c' : '#a09080', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14, textAlign: 'left' }}>
                <Icon size={14} /> {item.label}
              </button>
            )
          })}
          {!user && (
            <button onClick={() => { onAuthClick(); setMobileOpen(false) }} style={{ padding: '12px', background: '#f97316', border: 'none', borderRadius: 8, color: '#0a0a0f', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700, marginTop: 4 }}>
              Sign In / Get Started
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
