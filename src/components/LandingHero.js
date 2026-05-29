'use client'
import React, { useEffect, useRef, useState } from 'react'
import { BarChart2, ScanSearch, GitFork, ArrowRight, ArrowUpRight, Lock } from 'lucide-react'

const TICKER = [
  ['ATL Housing', '+8.2%', true], ['NYC Rent', '+4.1%', true], ['S&P 500', '+10.4%', true],
  ['Inflation', '3.1%', false], ['Austin Homes', '+7.3%', true], ['10yr Treasury', '4.6%', false],
  ['Avg Salary Growth', '+3.5%', true], ['Miami Rent', '+8.8%', true], ['Fed Rate', '5.33%', false],
]

const FEATURES = [
  {
    id: 'simulator', icon: BarChart2, color: '#f97316', bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.2)',
    number: '01', label: 'Future Simulator', tagline: 'See your net worth 30 years from now',
    desc: 'Enter your salary, city, and lifestyle. Get a real projection of your wealth, retirement age, and monthly cash flow adjusted for current market data.',
    bullets: ['30-year wealth and savings chart', 'Retirement age calculator', 'Monthly expense breakdown', 'Live market scenario modeling'],
  },
  {
    id: 'scanner', icon: ScanSearch, color: '#fb923c', bg: 'rgba(251,146,60,0.06)', border: 'rgba(251,146,60,0.2)',
    number: '02', label: 'Reality Scanner', tagline: 'Paste a listing. See every hidden cost.',
    desc: 'Paste any apartment ad, car listing, or describe a lifestyle. AI exposes hidden fees and shows the true 5-year cost.',
    bullets: ['Hidden fee detection', 'Required gross income calculator', '5-year cost projection', 'Affordability score out of 100'],
  },
  {
    id: 'decisions', icon: GitFork, color: '#fbbf24', bg: 'rgba(34,211,238,0.06)', border: 'rgba(34,211,238,0.2)',
    number: '03', label: 'Decision Engine', tagline: 'Compare two life paths side by side',
    desc: 'Startup vs corporate. Roommate vs solo. Pick a category, adjust the numbers, and see which path builds more wealth over 20 years.',
    bullets: ['Question-guided comparison setup', 'Fully editable inputs', '20-year net worth comparison', 'AI advisor recommendation'],
  },
]

export default function LandingHero({ setView, user }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState({})
  const sectionRefs = useRef({})

  useEffect(() => {
    setReady(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * 700,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.25 + 0.05,
      hue: Math.random() > 0.5 ? '155,126,248' : '192,132,252',
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.hue},${p.opacity})`; ctx.fill()
      })
      particlesRef.current.forEach((p, i) => {
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const d = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(249,115,22,${0.06 * (1 - d / 100)})`; ctx.lineWidth = 0.6; ctx.stroke()
          }
        })
      })
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    const onScroll = () => setScrollY(window.scrollY)
    const onMouse  = (e) => setParallax({ x: (e.clientX / window.innerWidth - 0.5) * 16, y: (e.clientY / window.innerHeight - 0.5) * 10 })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse)

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.dataset.key]: true })) })
    }, { threshold: 0.1 })
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el))

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
      observer.disconnect()
    }
  }, [])

  const ref = key => el => { if (el) { el.dataset.key = key; sectionRefs.current[key] = el } }
  const vis = key => !!visible[key]

  const section = (key, extra = {}) => ({
    ref: ref(key),
    style: { opacity: vis(key) ? 1 : 0, transform: vis(key) ? 'none' : 'translateY(24px)', transition: 'all 0.85s ease', ...extra }
  })

  return (
    <div style={{ background: '#0a0a0f', overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.9 }} />

        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: 680, height: 680, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.14) 0%, transparent 65%)', transform: `translate(${parallax.x * 0.4}px,${parallax.y * 0.4}px)`, transition: 'transform 0.5s ease' }} />
          <div style={{ position: 'absolute', bottom: '-12%', left: '-10%', width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)', transform: `translate(${-parallax.x * 0.25}px,${-parallax.y * 0.25}px)`, transition: 'transform 0.5s ease' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.18) 1px, transparent 1px)', backgroundSize: '42px 42px', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)', opacity: 0.4 }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '100px 40px 80px', width: '100%', transform: `translateY(${-scrollY * 0.07}px)`, opacity: ready ? 1 : 0, transition: 'opacity 0.5s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 390px', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 100, padding: '6px 16px', opacity: 0, animation: 'heroUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' }}>
                <span style={{ width: 6, height: 6, background: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#f97316', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>AI Life Planning System</span>
              </div>

              <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 22, opacity: 0, animation: 'heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' }}>
                <span style={{ display: 'block', fontSize: 'clamp(2.4rem, 5vw, 4.8rem)', color: '#f5f0eb' }}>Your life,</span>
                <span style={{ display: 'block', fontSize: 'clamp(2.4rem, 5vw, 4.8rem)' }}>
                  <span style={{ backgroundImage: 'linear-gradient(90deg, #f97316, #fb923c, #fbbf24, #f97316)', backgroundSize: '300% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradShift 4s linear infinite' }}>simulated.</span>
                </span>
              </h1>

              <p style={{ fontSize: 17, lineHeight: 1.75, color: '#a09080', maxWidth: 450, marginBottom: 40, opacity: 0, animation: 'heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.32s forwards' }}>
                The financial decisions you make today compound for decades. LifeOS shows you the{' '}
                <span style={{ color: '#f5f0eb', fontWeight: 600 }}>invisible consequences</span> before you make them.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28, opacity: 0, animation: 'heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.42s forwards' }}>
                <button onClick={() => setView('simulator')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 28px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', background: '#f97316', color: '#0a0a0f', boxShadow: '0 5px 20px rgba(249,115,22,0.35)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fb923c'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(249,115,22,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 5px 20px rgba(249,115,22,0.35)' }}>
                  Simulate My Future <ArrowRight size={16} strokeWidth={2.5} />
                </button>
                <button onClick={() => setView('auth')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 20px', borderRadius: 11, cursor: 'pointer', fontSize: 15, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', background: 'rgba(249,115,22,0.08)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.25)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; e.currentTarget.style.transform = 'none' }}>
                  <Lock size={14} /> {user ? 'My Dashboard' : 'Sign In Free'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', opacity: 0, animation: 'heroUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.52s forwards' }}>
                {[['Real market data', '#f97316'], ['Privacy first', '#4ade80'], ['Powered by Claude AI', '#fb923c']].map(([label, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4a3f35', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: color, display: 'inline-block' }} /> {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cards */}
            <div style={{ position: 'relative', height: 380, opacity: 0, animation: 'heroUp 1s cubic-bezier(0.16,1,0.3,1) 0.5s forwards' }}>
              {[
                { label: 'Net Worth at 40', value: '$284,000', sub: '+$220K from today', color: '#f97316', top: '0%', left: '0%', delay: '0s' },
                { label: 'Monthly Savings', value: '$1,840', sub: '28% of take-home', color: '#fb923c', top: '30%', left: '36%', delay: '0.4s' },
                { label: 'Retirement Age', value: 'Age 54', sub: '11 years early', color: '#fbbf24', top: '62%', left: '4%', delay: '0.8s' },
              ].map((card, i) => (
                <div key={card.label} style={{ position: 'absolute', top: card.top, left: card.left, background: '#111111', border: `1px solid ${card.color}30`, borderRadius: 16, padding: '18px 20px', minWidth: 190, boxShadow: `0 10px 32px rgba(0,0,0,0.5), 0 0 0 1px ${card.color}15`, animation: `floatCard ${5 + i}s ease-in-out ${card.delay} infinite` }}>
                  <div style={{ fontSize: 10, color: card.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, opacity: 0.7 }}>{card.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 21, fontWeight: 700, color: card.color, marginBottom: 4 }}>{card.value}</div>
                  <div style={{ fontSize: 11, color: '#4a3f35', fontFamily: 'DM Sans, sans-serif' }}>{card.sub}</div>
                </div>
              ))}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line x1="46%" y1="14%" x2="62%" y2="33%" stroke="rgba(249,115,22,0.18)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="62%" y1="40%" x2="30%" y2="64%" stroke="rgba(251,146,60,0.18)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.3 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: '#4a3f35', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, #f97316, transparent)' }} />
        </div>
      </section>

      {/* TICKER */}
      <div style={{ overflow: 'hidden', background: '#0d0d0d', borderTop: '1px solid rgba(249,115,22,0.1)', borderBottom: '1px solid rgba(249,115,22,0.1)', padding: '10px 0' }}>
        <div style={{ display: 'flex', gap: 52, whiteSpace: 'nowrap', animation: 'ticker 30s linear infinite' }}>
          {[...TICKER, ...TICKER, ...TICKER].map(([label, val, up], i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4a3f35', letterSpacing: '0.08em' }}>
              {label} <span style={{ color: up ? '#4ade80' : '#f87171', fontWeight: 600 }}>{val}</span>
              <span style={{ opacity: 0.2 }}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* DASHBOARD PROMO */}
      <section {...section('dash', { background: '#0d0d0d', borderBottom: '1px solid rgba(249,115,22,0.08)', padding: '72px 40px' })}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: '#f97316', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>Free Account</div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(1.6rem,3vw,2.4rem)', letterSpacing: '-0.025em', lineHeight: 1.1, color: '#f5f0eb', marginBottom: 18 }}>
              Track your finances.<br />See your progress over time.
            </h2>
            <p style={{ fontSize: 15, color: '#a09080', lineHeight: 1.75, marginBottom: 32, maxWidth: 400 }}>
              Create a free account to unlock a personal dashboard with spending charts, affordability scores, AI suggestions based on live market data, and your long-term net worth projection.
            </p>
            <button onClick={() => setView('auth')} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 26px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', background: '#f97316', color: '#0a0a0f', boxShadow: '0 4px 16px rgba(249,115,22,0.3)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fb923c'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'none' }}>
              Create Free Account <ArrowRight size={15} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Spending by Category', desc: 'Monthly breakdown with charts', color: '#f97316' },
              { label: 'Net Worth Projection', desc: '25-year trajectory based on your savings', color: '#fb923c' },
              { label: 'Location Affordability', desc: 'How your salary fits your city with live rent data', color: '#fbbf24' },
              { label: 'AI Suggestions', desc: 'Personalized improvements based on your numbers', color: '#fcd34d' },
            ].map(item => (
              <div key={item.label} style={{ background: '#111111', border: `1px solid ${item.color}20`, borderRadius: 14, padding: '18px 16px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, marginBottom: 10 }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f0eb', marginBottom: 5, fontFamily: 'DM Sans, sans-serif' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#4a3f35', lineHeight: 1.55, fontFamily: 'DM Sans, sans-serif' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section {...section('stats', { background: '#0a0a0f', borderBottom: '1px solid rgba(249,115,22,0.08)', padding: '52px 40px' })}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[['30yr', 'Financial projections'], ['15+', 'US cities tracked'], ['20+', 'Decision presets'], ['Free', 'No credit card needed']].map(([num, label], i) => (
            <div key={label} style={{ textAlign: 'center', padding: '18px 24px', borderRight: i < 3 ? '1px solid rgba(249,115,22,0.08)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: '#f97316', letterSpacing: '-0.03em', marginBottom: 6 }}>{num}</div>
              <div style={{ fontSize: 13, color: '#4a3f35', fontFamily: 'DM Sans, sans-serif' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 40px' }}>
        <div {...section('feat-head')} style={{ textAlign: 'center', marginBottom: 60, ...(vis('feat-head') ? {} : { opacity: 0, transform: 'translateY(22px)' }), transition: 'all 0.8s ease' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: '#4a3f35', textTransform: 'uppercase', marginBottom: 14 }}>Three tools</div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(1.7rem,3.5vw,2.8rem)', letterSpacing: '-0.025em', lineHeight: 1.1, color: '#f5f0eb' }}>
            Everything you need to make<br /><span style={{ color: '#f97316' }}>smarter decisions</span>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            const key  = `f${i}`
            return (
              <div key={f.id} ref={ref(key)} onClick={() => setView(f.id)} style={{
                display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 360px' : '360px 1fr',
                overflow: 'hidden', cursor: 'pointer', borderRadius: 20,
                background: '#111111', border: `1px solid ${f.border}`,
                boxShadow: '0 3px 16px rgba(0,0,0,0.4)',
                opacity: vis(key) ? 1 : 0, transform: vis(key) ? 'none' : 'translateY(28px)',
                transition: `opacity 0.85s ease ${i * 0.08}s, transform 0.85s ease ${i * 0.08}s, box-shadow 0.22s, border-color 0.22s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 30px ${f.color}18`; e.currentTarget.style.borderColor = f.color + '40'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 3px 16px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = f.border; e.currentTarget.style.transform = 'none' }}>

                <div style={{ padding: '44px 48px', order: i % 2 === 0 ? 0 : 1, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: -8, right: 14, fontFamily: 'var(--font-mono)', fontSize: 130, fontWeight: 800, color: f.color, opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{f.number}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                    <div style={{ width: 42, height: 42, background: f.bg, border: `1px solid ${f.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={f.color} strokeWidth={1.8} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: f.color, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{f.label}</span>
                  </div>
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(1.2rem,2vw,1.65rem)', letterSpacing: '-0.02em', lineHeight: 1.2, color: '#f5f0eb', marginBottom: 14 }}>{f.tagline}</h3>
                  <p style={{ fontSize: 14, color: '#a09080', lineHeight: 1.75, marginBottom: 28, maxWidth: 360, fontFamily: 'DM Sans, sans-serif' }}>{f.desc}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: f.bg, border: `1px solid ${f.border}`, borderRadius: 9, color: f.color, fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                    Open tool <ArrowUpRight size={13} strokeWidth={2.5} />
                  </div>
                </div>

                <div style={{ background: '#0d0d0d', order: i % 2 === 0 ? 1 : 0, padding: '40px 28px', display: 'flex', alignItems: 'center', borderLeft: i % 2 === 0 ? `1px solid ${f.border}` : 'none', borderRight: i % 2 !== 0 ? `1px solid ${f.border}` : 'none' }}>
                  <div style={{ background: '#111111', border: `1px solid ${f.border}`, borderRadius: 14, padding: '20px 18px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${f.border}` }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: f.color }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: f.color, letterSpacing: '0.1em', fontWeight: 700 }}>{f.label}</span>
                    </div>
                    {f.bullets.map((b, bi) => (
                      <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 5, background: bi === 0 ? f.bg : 'transparent', border: `1px solid ${bi === 0 ? f.border : 'transparent'}`, borderRadius: 8 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: f.color, opacity: bi === 0 ? 1 : 0.4, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontFamily: 'DM Sans, sans-serif', color: bi === 0 ? '#f5f0eb' : '#4a3f35' }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section {...section('cta', { position: 'relative', padding: '96px 40px 112px', textAlign: 'center', overflow: 'hidden' })}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.14) 1px, transparent 1px)', backgroundSize: '38px 38px', opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(234,88,12,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: '#4a3f35', textTransform: 'uppercase', marginBottom: 22 }}>Ready to see your future?</div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 'clamp(2rem,5vw,3.8rem)', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: 22, color: '#f5f0eb' }}>
            Stop guessing.<br /><span style={{ color: '#f97316' }}>Start knowing.</span>
          </h2>
          <p style={{ color: '#a09080', fontSize: 16, lineHeight: 1.75, marginBottom: 44 }}>60 seconds to simulate your next 30 years. No signup required.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setView('simulator')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 34px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', background: '#f97316', color: '#0a0a0f', boxShadow: '0 6px 24px rgba(249,115,22,0.35)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fb923c'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(249,115,22,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(249,115,22,0.35)' }}>
              Simulate My Future <ArrowRight size={16} strokeWidth={2.5} />
            </button>
            <button onClick={() => setView('auth')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 22px', borderRadius: 12, cursor: 'pointer', fontSize: 15, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', background: 'rgba(249,115,22,0.08)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.25)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.14)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; e.currentTarget.style.transform = 'none' }}>
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      <div style={{ borderTop: '1px solid rgba(249,115,22,0.1)', background: '#0d0d0d', padding: '22px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4a3f35', letterSpacing: '0.08em' }}>LIFEOS — Powered by Claude AI</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['simulator','Future Simulator'],['scanner','Reality Scanner'],['decisions','Decision Engine']].map(([id,t]) => (
            <button key={id} onClick={() => setView(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#4a3f35', letterSpacing: '0.06em', transition: 'color 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a3f35'}>{t}</button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
        @media(max-width:900px){
          section>div>div[style*="1fr 390px"],
          section>div>div[style*="1fr 1fr"] { grid-template-columns:1fr!important }
          section>div[style*="repeat(4"] { grid-template-columns:repeat(2,1fr)!important }
        }
      `}</style>
    </div>
  )
}
