'use client'
import React, { useState } from 'react'
import { ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { login, signup, updateProfile } from '@/lib/auth'
import { CITIES } from '@/lib/financialEngine'

const CITY_LIST = Object.keys(CITIES)

// Onboarding steps after signup
const STEPS = [
  {
    id: 'income',
    title: 'What is your annual income?',
    subtitle: 'Before taxes. This is used only to personalize your projections.',
    field: 'salary',
    type: 'currency',
    placeholder: '65000',
    hint: 'Enter your gross annual salary in dollars',
  },
  {
    id: 'city',
    title: 'Where do you live?',
    subtitle: 'We use this to apply real local rent, tax, and cost data to your dashboard.',
    field: 'city',
    type: 'select',
    options: CITY_LIST,
  },
  {
    id: 'rent',
    title: 'How much do you pay for housing each month?',
    subtitle: 'Rent or mortgage payment only. We will separate out other expenses next.',
    field: 'monthlyRent',
    type: 'currency',
    placeholder: '1500',
    hint: 'Your rent or mortgage payment per month',
  },
  {
    id: 'expenses',
    title: 'What are your other monthly expenses?',
    subtitle: 'Estimates are fine. These feed your spending chart directly.',
    type: 'multifield',
    fields: [
      { key: 'groceries',     label: 'Groceries',      placeholder: '400'  },
      { key: 'transport',     label: 'Transport',       placeholder: '200'  },
      { key: 'diningOut',     label: 'Dining out',      placeholder: '250'  },
      { key: 'entertainment', label: 'Entertainment',   placeholder: '120'  },
      { key: 'utilities',     label: 'Utilities',       placeholder: '130'  },
      { key: 'health',        label: 'Health / medical',placeholder: '80'   },
      { key: 'shopping',      label: 'Shopping',        placeholder: '180'  },
      { key: 'subscriptions', label: 'Subscriptions',   placeholder: '60'   },
    ],
  },
  {
    id: 'savings',
    title: 'How much do you currently have saved?',
    subtitle: 'Total across all accounts — checking, savings, investments.',
    field: 'savings',
    type: 'currency',
    placeholder: '5000',
    hint: 'Combined total in all your accounts',
  },
  {
    id: 'debt',
    title: 'What is your total outstanding debt?',
    subtitle: 'Student loans, car loans, credit card balances combined. Enter 0 if none.',
    field: 'debt',
    type: 'currency',
    placeholder: '0',
    hint: 'Do not include your mortgage if you listed it as rent above',
  },
  {
    id: 'savings_rate',
    title: 'What portion of your leftover income do you invest or save?',
    subtitle: 'This is after all your expenses are paid.',
    field: 'investmentRate',
    type: 'choice',
    choices: [
      { label: 'Nothing right now', value: 0.0 },
      { label: 'Around 10%',        value: 0.1 },
      { label: 'Around 20%',        value: 0.2 },
      { label: 'Around 30%',        value: 0.3 },
      { label: '40% or more',       value: 0.4 },
    ],
  },
]

const S = {
  wrap: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' },
  orb1: { position: 'fixed', top: '-15%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 65%)', pointerEvents: 'none' },
  orb2: { position: 'fixed', bottom: '-12%', left: '-10%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)', pointerEvents: 'none' },
  grid: { position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(249,115,22,0.14) 1px, transparent 1px)', backgroundSize: '38px 38px', opacity: 0.35, pointerEvents: 'none' },
  card: { position: 'relative', zIndex: 1, width: '100%', maxWidth: 480, background: '#111111', borderRadius: 22, border: '1px solid rgba(249,115,22,0.18)', boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.06)', padding: '44px 40px' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 },
  logoBox: { width: 36, height: 36, background: 'linear-gradient(135deg, #ea580c, #f97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(234,88,12,0.4)' },
  logoText: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em', color: '#f5f0eb' },
  h1: { fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 24, color: '#f5f0eb', marginBottom: 7, letterSpacing: '-0.02em' },
  sub: { color: '#a09080', fontSize: 14, marginBottom: 32, lineHeight: 1.55 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#a09080', marginBottom: 6, fontFamily: 'DM Sans, sans-serif' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center', background: '#0d0d0d', border: '1.5px solid rgba(249,115,22,0.22)', borderRadius: 11, overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s' },
  prefix: { padding: '0 11px', color: '#4a3f35', fontFamily: 'var(--font-mono)', fontSize: 14, borderRight: '1px solid rgba(249,115,22,0.15)', flexShrink: 0, userSelect: 'none' },
  input: { flex: 1, padding: '12px 14px', background: 'transparent', border: 'none', outline: 'none', color: '#f5f0eb', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700 },
  hint: { fontSize: 11, color: '#4a3f35', marginTop: 4 },
  btn: { width: '100%', padding: 13, borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', background: '#f97316', color: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(249,115,22,0.35)', transition: 'all 0.2s' },
  btnDisabled: { background: '#3d2d6e', color: '#c2410c', cursor: 'not-allowed', boxShadow: 'none' },
  toggle: { display: 'flex', background: 'rgba(249,115,22,0.08)', borderRadius: 9, padding: 3, marginBottom: 28 },
  toggleBtn: (active) => ({ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', borderRadius: 7, fontSize: 14, fontWeight: active ? 700 : 500, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.18s', background: active ? '#f97316' : 'transparent', color: active ? '#0a0a0f' : '#a09080', boxShadow: active ? '0 1px 6px rgba(249,115,22,0.3)' : 'none' }),
  error: { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 10, padding: '11px 16px', marginBottom: 18, fontSize: 13, color: '#f87171' },
  link: { background: 'none', border: 'none', cursor: 'pointer', color: '#f97316', fontWeight: 600, fontSize: 13, fontFamily: 'DM Sans, sans-serif', padding: 0 },
}

function focusInput(e) { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }
function blurInput(e)  { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.22)'; e.currentTarget.style.boxShadow = 'none'; }

export default function AuthPage({ onSuccess, onBack }) {
  const [mode, setMode] = useState('login')
  const [stage, setStage] = useState('auth')  // 'auth' | 'onboarding'
  const [step, setStep]   = useState(0)
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingUser, setPendingUser] = useState(null)
  const [answers, setAnswers] = useState({ salary: '', city: CITY_LIST[0], monthlyRent: '', groceries: '', transport: '', diningOut: '', entertainment: '', utilities: '', health: '', shopping: '', subscriptions: '', savings: '', debt: '', investmentRate: 0.2 })

  const setAns = (k, v) => setAnswers(a => ({ ...a, [k]: v }))

  const submitAuth = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 350))
    if (mode === 'login') {
      const result = login(email, password)
      setLoading(false)
      if (result.error) { setError(result.error); return }
      onSuccess(result.user)
    } else {
      if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return }
      // Pre-create user with blank profile, onboarding will fill it
      const result = signup(email, password, name)
      setLoading(false)
      if (result.error) { setError(result.error); return }
      setPendingUser(result.user)
      setStage('onboarding')
    }
  }

  const submitOnboarding = () => {
    
    const profile = {
      salary:         Number(answers.salary)    || 65000,
      city:           answers.city,
      monthlyRent:    Number(answers.monthlyRent) || 1500,
      groceries:      Number(answers.groceries)   || 400,
      transport:      Number(answers.transport)   || 200,
      diningOut:      Number(answers.diningOut)   || 250,
      entertainment:  Number(answers.entertainment)|| 120,
      utilities:      Number(answers.utilities)   || 130,
      health:         Number(answers.health)      || 80,
      shopping:       Number(answers.shopping)    || 180,
      subscriptions:  Number(answers.subscriptions)|| 60,
      savings:        Number(answers.savings)     || 5000,
      debt:           Number(answers.debt)        || 0,
      investmentRate: answers.investmentRate,
      get monthlyExpenses() {
        return (this.monthlyRent + this.groceries + this.transport + this.diningOut + this.entertainment + this.utilities + this.health + this.shopping + this.subscriptions)
      },
    }
    const updated = updateProfile({ profile })
    onSuccess(updated || pendingUser)
  }

  const currentStep = STEPS[step]
  const isLastStep  = step === STEPS.length - 1

  const canAdvance = () => {
    if (!currentStep) return false
    if (currentStep.type === 'select')    return true
    if (currentStep.type === 'choice')    return answers[currentStep.field] !== undefined
    if (currentStep.type === 'multifield') return true // all optional
    const val = answers[currentStep.field]
    return val !== '' && val !== undefined
  }

  // ── Auth stage ────────────────────────────────────────────────
  if (stage === 'auth') return (
    <div style={S.wrap}>
      <div style={S.orb1} /><div style={S.orb2} /><div style={S.grid} />
      <div style={S.card}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', color: '#a09080', fontSize: 13, fontFamily: 'DM Sans, sans-serif', marginBottom: 28, padding: 0, transition: 'color 0.18s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
          onMouseLeave={e => e.currentTarget.style.color = '#a09080'}>
          <ArrowLeft size={14} /> Back to LifeOS
        </button>

        <div style={S.logo}>
          <div style={S.logoBox}><span style={{ color: '#0a0a0f', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>L</span></div>
          <span style={S.logoText}>Life<span style={{ color: '#f97316' }}>OS</span></span>
        </div>

        <h1 style={S.h1}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p style={S.sub}>{mode === 'login' ? 'Sign in to your personal financial dashboard.' : 'Takes 2 minutes. We will personalize everything for you.'}</p>

        <div style={S.toggle}>
          <button style={S.toggleBtn(mode === 'login')}  onClick={() => { setMode('login');  setError('') }}>Sign In</button>
          <button style={S.toggleBtn(mode === 'signup')} onClick={() => { setMode('signup'); setError('') }}>Sign Up</button>
        </div>

        <form onSubmit={submitAuth}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 18 }}>
              <label style={S.label}>Full Name</label>
              <div style={S.inputWrap} onFocus={focusInput} onBlur={blurInput}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required
                  style={{ ...S.input, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }} />
              </div>
            </div>
          )}
          <div style={{ marginBottom: 18 }}>
            <label style={S.label}>Email</label>
            <div style={S.inputWrap} onFocus={focusInput} onBlur={blurInput}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ ...S.input, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }} />
            </div>
          </div>
          <div style={{ marginBottom: error ? 14 : 26 }}>
            <label style={S.label}>Password</label>
            <div style={S.inputWrap} onFocus={focusInput} onBlur={blurInput}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'} required
                style={{ ...S.input, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', fontSize: 14, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#4a3f35', padding: 0 }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <div style={S.error}>{error}</div>}
          <button type="submit" disabled={loading} style={loading ? { ...S.btn, ...S.btnDisabled } : S.btn}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#fb923c'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'none'; } }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Processing</> : <>{mode === 'login' ? 'Sign In' : 'Continue'} <ArrowRight size={15} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#4a3f35' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
          <button style={S.link} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#4a3f35' }}>
          <button onClick={onBack} style={{ ...S.link, fontSize: 12, color: '#4a3f35' }}>Continue without an account</button>
          {' '}to use all tools for free.
        </p>
      </div>
    </div>
  )

  // ── Onboarding stage ──────────────────────────────────────────
  const pct = Math.round(((step + 1) / STEPS.length) * 100)

  return (
    <div style={S.wrap}>
      <div style={S.orb1} /><div style={S.orb2} /><div style={S.grid} />
      <div style={{ ...S.card, maxWidth: currentStep.type === 'multifield' ? 580 : 480 }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={S.logo}>
            <div style={S.logoBox}><span style={{ color: '#0a0a0f', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>L</span></div>
            <span style={S.logoText}>Life<span style={{ color: '#f97316' }}>OS</span></span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#4a3f35', letterSpacing: '0.1em' }}>{step + 1} / {STEPS.length}</span>
        </div>
        <div style={{ height: 3, background: 'rgba(249,115,22,0.15)', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #ea580c, #f97316)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>

        <h1 style={{ ...S.h1, fontSize: 21, marginBottom: 8 }}>{currentStep.title}</h1>
        <p style={{ ...S.sub, marginBottom: 28 }}>{currentStep.subtitle}</p>

        {/* Currency input */}
        {currentStep.type === 'currency' && (
          <div style={{ marginBottom: 24 }}>
            <div style={S.inputWrap} onFocus={focusInput} onBlur={blurInput}>
              <span style={S.prefix}>$</span>
              <input type="number" min="0" value={answers[currentStep.field]} onChange={e => setAns(currentStep.field, e.target.value)}
                placeholder={currentStep.placeholder} style={S.input} autoFocus />
            </div>
            {currentStep.hint && <div style={S.hint}>{currentStep.hint}</div>}
          </div>
        )}

        {/* City select */}
        {currentStep.type === 'select' && (
          <div style={{ marginBottom: 24 }}>
            <select value={answers[currentStep.field]} onChange={e => setAns(currentStep.field, e.target.value)}
              style={{ background: '#0d0d0d', border: '1.5px solid rgba(249,115,22,0.22)', borderRadius: 11, padding: '12px 14px', color: '#f5f0eb', fontFamily: 'DM Sans, sans-serif', fontSize: 14, width: '100%', outline: 'none', cursor: 'pointer' }}>
              {currentStep.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        )}

        {/* Choice buttons */}
        {currentStep.type === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {currentStep.choices.map(c => {
              const active = answers[currentStep.field] === c.value
              return (
                <button key={c.value} onClick={() => setAns(currentStep.field, c.value)} style={{
                  padding: '13px 18px', textAlign: 'left', cursor: 'pointer', borderRadius: 11, border: `1.5px solid ${active ? '#f97316' : 'rgba(249,115,22,0.18)'}`,
                  background: active ? 'rgba(249,115,22,0.12)' : 'transparent', color: active ? '#fb923c' : '#a09080',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: active ? 600 : 400, transition: 'all 0.18s',
                }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.35)'; e.currentTarget.style.color = '#f5f0eb'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.18)'; e.currentTarget.style.color = '#a09080'; } }}>
                  {c.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Multi-field */}
        {currentStep.type === 'multifield' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            {currentStep.fields.map(f => (
              <div key={f.key}>
                <label style={{ ...S.label, marginBottom: 5 }}>{f.label}</label>
                <div style={S.inputWrap} onFocus={focusInput} onBlur={blurInput}>
                  <span style={S.prefix}>$</span>
                  <input type="number" min="0" value={answers[f.key]} onChange={e => setAns(f.key, e.target.value)}
                    placeholder={f.placeholder} style={{ ...S.input, fontSize: 14 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: '12px 18px', background: 'transparent', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 11, cursor: 'pointer', color: '#a09080', fontFamily: 'DM Sans, sans-serif', fontSize: 14, display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.25)'; e.currentTarget.style.color = '#a09080'; }}>
              <ArrowLeft size={14} /> Back
            </button>
          )}
          <button onClick={isLastStep ? submitOnboarding : () => setStep(s => s + 1)}
            disabled={!canAdvance()}
            style={{ flex: 1, padding: 12, borderRadius: 11, border: 'none', cursor: canAdvance() ? 'pointer' : 'not-allowed', fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', background: canAdvance() ? '#f97316' : '#3d2d6e', color: canAdvance() ? '#0a0a0f' : '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: canAdvance() ? '0 4px 18px rgba(249,115,22,0.3)' : 'none', transition: 'all 0.2s' }}>
            {isLastStep ? 'Open My Dashboard' : 'Continue'} <ArrowRight size={15} />
          </button>
        </div>

        {!isLastStep && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#4a3f35' }}>
            <button onClick={isLastStep ? submitOnboarding : () => setStep(s => s + 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a3f35', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
              Skip this question
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
