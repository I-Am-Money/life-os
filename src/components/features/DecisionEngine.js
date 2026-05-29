'use client'
import React, { useState } from 'react'
import { GitFork, TrendingUp, AlertTriangle, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import { CITIES, compareDecisions, formatCurrency } from '@/lib/financialEngine'

//  Question Tree 
const QUESTION_TREE = {
  root: {
    question: 'What are you trying to decide between?',
    subtitle: 'Choose the category that best fits your decision',
    options: [
      { label: ' Education', desc: 'Colleges, degrees, schools', next: 'education' },
      { label: ' Housing', desc: 'Apartments, houses, roommates', next: 'housing' },
      { label: ' Job / Career', desc: 'Job offers, startup vs corporate', next: 'job' },
      { label: ' Vehicle', desc: 'Cars, trucks, no car', next: 'vehicle' },
      { label: '️ City / Location', desc: 'Where to live or move', next: 'city' },
      { label: '️ Insurance', desc: 'Health, car, life insurance', next: 'insurance' },
      { label: '️ Custom — Enter my own numbers', desc: 'I know what I want to compare', preset: '__custom__' },
    ]
  },
  education: {
    question: 'What type of education decision?',
    options: [
      { label: ' In-state vs Out-of-state college', desc: 'Same degree, very different cost', preset: 'college_instate' },
      { label: ' Public vs Private university', desc: 'Cost vs prestige', preset: 'college_public_private' },
      { label: ' STEM vs Liberal Arts', desc: 'Different salary paths', preset: 'college_stem_arts' },
      { label: ' Graduate school vs Work now', desc: 'More education or start earning', preset: 'grad_vs_work' },
    ]
  },
  housing: {
    question: 'What is your housing decision?',
    options: [
      { label: ' Roommate vs Living alone', desc: 'Save money or have privacy', preset: 'roommate' },
      { label: ' Renting vs Buying a home', desc: 'Flexibility vs ownership', preset: 'rent_vs_buy' },
      { label: '️ City apartment vs Suburban house', desc: 'Urban life vs suburban space', preset: 'city_vs_suburb' },
      { label: ' Studio vs 1-Bedroom', desc: 'Smaller and cheaper vs more space', preset: 'studio_vs_1br' },
    ]
  },
  job: {
    question: 'What kind of career decision?',
    options: [
      { label: ' Startup vs Big company', desc: 'Risk and reward vs stability', preset: 'startup_vs_corp' },
      { label: ' High pay vs Work-life balance', desc: 'More money or more free time', preset: 'highpay_vs_balance' },
      { label: ' Remote vs In-office job', desc: 'Work from home vs office', preset: 'remote_vs_office' },
      { label: ' Stay in city vs Relocate', desc: 'Same city or move for opportunity', preset: 'stay_vs_move' },
    ]
  },
  vehicle: {
    question: 'What is your vehicle decision?',
    options: [
      { label: '️ Luxury vs Reliable car', desc: 'Status vs financial sense', preset: 'luxury_vs_reliable' },
      { label: ' Buy vs Lease a car', desc: 'Own it or return it after 3 years', preset: 'buy_vs_lease' },
      { label: ' Electric vs Gas car', desc: 'EV vs traditional car', preset: 'ev_vs_gas' },
      { label: ' Own a car vs No car', desc: 'Car payments vs transit/rideshare', preset: 'car_vs_nocar' },
    ]
  },
  city: {
    question: 'What city decision are you making?',
    options: [
      { label: ' High-cost vs Low-cost city', desc: 'Big city salary vs lower cost living', preset: 'highcost_vs_lowcost_city' },
      { label: '️ Sun Belt vs Northeast', desc: 'Atlanta/Miami vs NYC/Boston', preset: 'sunbelt_vs_northeast' },
      { label: '️ Live with parents vs Move out', desc: 'Save money vs independence', preset: 'home_vs_moveout' },
    ]
  },
  insurance: {
    question: 'What type of insurance decision?',
    options: [
      { label: ' High-deductible vs Low-deductible health plan', desc: 'Pay less monthly or at the doctor', preset: 'hdhp_vs_ppo' },
      { label: ' Full coverage vs Liability-only car insurance', desc: 'Full protection vs minimum required', preset: 'full_vs_liability' },
    ]
  },
}

//  Preset starting values 
const PRESETS = {
  college_instate:        { label: 'In-state vs Out-of-state College',      a: { label: 'In-State University',        salary: 62000, salaryGrowthRate: 3.5, upfrontCost: 18000, debt: 28000, debtPayoff: 280, monthlyExpenses: 2200 }, b: { label: 'Out-of-State University',     salary: 64000, salaryGrowthRate: 4.0, upfrontCost: 40000, debt: 72000, debtPayoff: 720, monthlyExpenses: 2400 } },
  college_public_private: { label: 'Public vs Private University',           a: { label: 'Public University',          salary: 60000, salaryGrowthRate: 3.5, upfrontCost: 22000, debt: 35000, debtPayoff: 350, monthlyExpenses: 2200 }, b: { label: 'Private University',          salary: 72000, salaryGrowthRate: 5.0, upfrontCost: 55000, debt: 90000, debtPayoff: 900, monthlyExpenses: 2400 } },
  college_stem_arts:      { label: 'STEM vs Liberal Arts',                   a: { label: 'STEM Degree',                salary: 82000, salaryGrowthRate: 5.0, upfrontCost: 35000, debt: 50000, debtPayoff: 500, monthlyExpenses: 2500 }, b: { label: 'Liberal Arts Degree',         salary: 48000, salaryGrowthRate: 2.5, upfrontCost: 30000, debt: 45000, debtPayoff: 450, monthlyExpenses: 2200 } },
  grad_vs_work:           { label: 'Graduate School vs Work Now',             a: { label: 'Graduate School (2 yrs)',    salary: 85000, salaryGrowthRate: 5.5, upfrontCost: 60000, debt: 55000, debtPayoff: 550, monthlyExpenses: 2400 }, b: { label: 'Start Working Now',           salary: 58000, salaryGrowthRate: 4.0, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2500 } },
  roommate:               { label: 'Roommate vs Living Alone',                a: { label: 'With Roommate',              salary: 65000, salaryGrowthRate: 3.5, upfrontCost: 2500,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 2500 }, b: { label: 'Solo Apartment',              salary: 65000, salaryGrowthRate: 3.5, upfrontCost: 4000,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 3400 } },
  rent_vs_buy:            { label: 'Renting vs Buying a Home',                a: { label: 'Rent Apartment',             salary: 80000, salaryGrowthRate: 3.5, upfrontCost: 3500,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 3200 }, b: { label: 'Buy a Home',                  salary: 80000, salaryGrowthRate: 3.5, upfrontCost: 40000, debt: 320000,debtPayoff: 1800,monthlyExpenses: 3800 } },
  city_vs_suburb:         { label: 'City Apartment vs Suburban House',        a: { label: 'Urban Apartment',            salary: 75000, salaryGrowthRate: 4.0, upfrontCost: 3000,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 3600 }, b: { label: 'Suburban House',              salary: 75000, salaryGrowthRate: 4.0, upfrontCost: 25000, debt: 280000,debtPayoff: 1600,monthlyExpenses: 3100 } },
  studio_vs_1br:          { label: 'Studio vs 1-Bedroom',                     a: { label: 'Studio Apartment',           salary: 55000, salaryGrowthRate: 3.5, upfrontCost: 2800,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 2600 }, b: { label: '1-Bedroom Apartment',         salary: 55000, salaryGrowthRate: 3.5, upfrontCost: 3800,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 3100 } },
  startup_vs_corp:        { label: 'Startup vs Corporate Job',                a: { label: 'Startup',                    salary: 72000, salaryGrowthRate: 7.0, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2600 }, b: { label: 'Corporate Job',               salary: 88000, salaryGrowthRate: 3.0, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2700 } },
  highpay_vs_balance:     { label: 'High Pay vs Work-Life Balance',           a: { label: 'High-Pay Job',               salary: 120000,salaryGrowthRate: 4.0, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 3500 }, b: { label: 'Balanced Job',                salary: 75000, salaryGrowthRate: 3.0, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2800 } },
  remote_vs_office:       { label: 'Remote Work vs In-Office',                a: { label: 'Remote Job',                 salary: 85000, salaryGrowthRate: 3.0, upfrontCost: 2000,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 2800 }, b: { label: 'In-Office Job',               salary: 90000, salaryGrowthRate: 4.0, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 3200 } },
  stay_vs_move:           { label: 'Stay in City vs Relocate',                a: { label: 'Stay (Current City)',        salary: 70000, salaryGrowthRate: 3.0, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 3000 }, b: { label: 'Relocate for Opportunity',    salary: 95000, salaryGrowthRate: 5.0, upfrontCost: 8000,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 3800 } },
  luxury_vs_reliable:     { label: 'Luxury vs Reliable Car',                  a: { label: 'Luxury Car (BMW/Tesla)',     salary: 65000, salaryGrowthRate: 3.5, upfrontCost: 8000,  debt: 45000, debtPayoff: 900, monthlyExpenses: 3300 }, b: { label: 'Reliable Car (Toyota/Honda)', salary: 65000, salaryGrowthRate: 3.5, upfrontCost: 3000,  debt: 18000, debtPayoff: 300, monthlyExpenses: 2700 } },
  buy_vs_lease:           { label: 'Buy vs Lease a Car',                      a: { label: 'Buy (Finance)',              salary: 65000, salaryGrowthRate: 3.5, upfrontCost: 4000,  debt: 22000, debtPayoff: 400, monthlyExpenses: 2750 }, b: { label: 'Lease',                       salary: 65000, salaryGrowthRate: 3.5, upfrontCost: 2000,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 3000 } },
  ev_vs_gas:              { label: 'Electric vs Gas Car',                     a: { label: 'Electric Vehicle',           salary: 70000, salaryGrowthRate: 3.5, upfrontCost: 6000,  debt: 38000, debtPayoff: 650, monthlyExpenses: 2800 }, b: { label: 'Gas Car',                     salary: 70000, salaryGrowthRate: 3.5, upfrontCost: 3000,  debt: 22000, debtPayoff: 380, monthlyExpenses: 2900 } },
  car_vs_nocar:           { label: 'Own a Car vs No Car',                     a: { label: 'Own a Car',                  salary: 60000, salaryGrowthRate: 3.5, upfrontCost: 3500,  debt: 18000, debtPayoff: 320, monthlyExpenses: 3100 }, b: { label: 'No Car (Transit/Rideshare)',   salary: 60000, salaryGrowthRate: 3.5, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2400 } },
  highcost_vs_lowcost_city:{ label: 'High-Cost vs Low-Cost City',             a: { label: 'High-Cost City (NYC/SF)',    salary: 110000,salaryGrowthRate: 4.0, upfrontCost: 5000,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 5000 }, b: { label: 'Low-Cost City (Atlanta)',      salary: 80000, salaryGrowthRate: 4.0, upfrontCost: 3000,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 2800 } },
  sunbelt_vs_northeast:   { label: 'Sun Belt vs Northeast City',              a: { label: 'Sun Belt (Atlanta/Miami)',   salary: 72000, salaryGrowthRate: 4.0, upfrontCost: 3000,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 2900 }, b: { label: 'Northeast (NYC/Boston)',       salary: 95000, salaryGrowthRate: 3.5, upfrontCost: 4500,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 5200 } },
  home_vs_moveout:        { label: 'Live with Parents vs Move Out',           a: { label: 'Live with Parents',          salary: 55000, salaryGrowthRate: 4.0, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 1200 }, b: { label: 'Move Out Solo',               salary: 55000, salaryGrowthRate: 4.0, upfrontCost: 3500,  debt: 0,     debtPayoff: 0,   monthlyExpenses: 3200 } },
  hdhp_vs_ppo:            { label: 'HDHP vs PPO Health Insurance',            a: { label: 'High-Deductible Plan (HDHP)',salary: 65000, salaryGrowthRate: 3.5, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2550 }, b: { label: 'PPO / Low-Deductible Plan',   salary: 65000, salaryGrowthRate: 3.5, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2750 } },
  full_vs_liability:      { label: 'Full Coverage vs Liability-Only Insurance',a: { label: 'Full Coverage',             salary: 55000, salaryGrowthRate: 3.5, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2680 }, b: { label: 'Liability Only',               salary: 55000, salaryGrowthRate: 3.5, upfrontCost: 0,     debt: 0,     debtPayoff: 0,   monthlyExpenses: 2540 } },
}

const BLANK = { label: '', salary: 60000, salaryGrowthRate: 3.5, upfrontCost: 0, debt: 0, debtPayoff: 0, monthlyExpenses: 2500 }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#111111', border: '1px solid var(--border-bright)', borderRadius: 10, padding: '12px 16px', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
      <div style={{ color: '#4a3f35', marginBottom: 8 }}>Year {label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color, marginBottom: 4 }}>{p.name}: {formatCurrency(p.value)}</div>)}
    </div>
  )
}

// Editable number field
function Field({ label, value, onChange, prefix = '$', suffix = '', helper = '', min = 0, max = 999999 }) {
  const [raw, setRaw] = useState(String(value))
  const [focused, setFocused] = useState(false)
  React.useEffect(() => { if (!focused) setRaw(String(value)) }, [value, focused])
  const commit = () => {
    const p = parseFloat(raw.replace(/[^0-9.-]/g, ''))
    if (!isNaN(p)) { const c = Math.min(max, Math.max(min, p)); onChange(c); setRaw(String(c)) }
    else setRaw(String(value))
    setFocused(false)
  }
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', border: `1px solid ${focused ? '#f97316' : 'var(--border-bright)'}`, borderRadius: 8, overflow: 'hidden', transition: 'border-color 0.2s' }}>
        {prefix && <span style={{ padding: '0 8px', color: '#4a3f35', fontFamily: 'var(--font-mono)', fontSize: 13, borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{prefix}</span>}
        <input
          type="text" value={raw}
          onFocus={() => { setFocused(true); setRaw(String(value)) }}
          onChange={e => setRaw(e.target.value)}
          onBlur={commit}
          onKeyDown={e => e.key === 'Enter' && commit()}
          style={{ flex: 1, padding: '9px 10px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, outline: 'none' }}
        />
        {suffix && <span style={{ padding: '0 8px', color: '#4a3f35', fontSize: 12, whiteSpace: 'nowrap' }}>{suffix}</span>}
      </div>
      {helper && <div style={{ fontSize: 10, color: '#4a3f35', marginTop: 3 }}>{helper}</div>}
    </div>
  )
}

function OptionForm({ data, onChange, color, side }) {
  const set = (key, val) => onChange({ ...data, [key]: val })
  return (
    <div className="panel" style={{ borderColor: color + '30' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: color + '20', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color }}>{side}</div>
          <input
            type="text" value={data.label}
            onChange={e => set('label', e.target.value)}
            placeholder={`Name Option ${side}...`}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color, width: '100%' }}
          />
        </div>
      </div>
      <div className="panel-body">
        <Field label=" Annual Salary (before taxes)" value={data.salary} onChange={v => set('salary', v)} max={500000} helper="How much you earn per year" />
        <Field label=" Salary Growth Rate" value={data.salaryGrowthRate} onChange={v => set('salaryGrowthRate', v)} prefix="%" suffix="per year" min={0} max={20} helper="e.g. enter 3.5 for 3.5% growth per year" />
        <Field label=" Monthly Expenses (all costs)" value={data.monthlyExpenses} onChange={v => set('monthlyExpenses', v)} suffix="/month" max={20000} helper="Rent + food + transport + everything" />
        <Field label=" Upfront / One-Time Cost" value={data.upfrontCost} onChange={v => set('upfrontCost', v)} max={500000} helper="Moving costs, deposits, school fees, etc. (0 if none)" />
        <Field label=" Total Debt (loans)" value={data.debt} onChange={v => set('debt', v)} max={999999} helper="Student loans, car loans, etc. (0 if none)" />
        {data.debt > 0 && (
          <Field label=" Monthly Debt Payment" value={data.debtPayoff} onChange={v => set('debtPayoff', v)} suffix="/month" max={10000} helper="How much you pay toward debt each month" />
        )}
      </div>
    </div>
  )
}

export default function DecisionEngine() {
  const [path, setPath] = useState(['root'])
  const [stage, setStage] = useState('tree')   // 'tree' | 'inputs' | 'results'
  const [scenarioLabel, setScenarioLabel] = useState('')
  const [optA, setOptA] = useState({ ...BLANK, label: 'Option A' })
  const [optB, setOptB] = useState({ ...BLANK, label: 'Option B' })
  const [cityKey, setCityKey] = useState('Atlanta, GA')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiInsight, setAiInsight] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const currentNode = QUESTION_TREE[path[path.length - 1]]

  const toCompareParams = (d) => ({
    label: d.label,
    salary: d.salary,
    salaryGrowthRate: d.salaryGrowthRate / 100,
    upfrontCost: d.upfrontCost,
    debt: d.debt,
    debtPayoff: d.debtPayoff,
    monthlyExpenses: d.monthlyExpenses,
    happiness: 65,
  })

  const handleOption = (option) => {
    if (option.preset === '__custom__') {
      setOptA({ ...BLANK, label: 'Option A' })
      setOptB({ ...BLANK, label: 'Option B' })
      setScenarioLabel('Custom Comparison')
      setStage('inputs')
    } else if (option.preset) {
      const p = PRESETS[option.preset]
      setOptA({ ...p.a })
      setOptB({ ...p.b })
      setScenarioLabel(p.label)
      setStage('inputs')
    } else if (option.next) {
      setPath(prev => [...prev, option.next])
    }
  }

  const goBack = () => {
    if (stage === 'inputs') { setStage('tree'); setResults(null); setAiInsight('') }
    else if (stage === 'results') { setStage('inputs'); setResults(null); setAiInsight('') }
    else if (path.length > 1) setPath(p => p.slice(0, -1))
  }

  const reset = () => {
    setPath(['root']); setStage('tree'); setResults(null); setAiInsight('')
    setOptA({ ...BLANK, label: 'Option A' }); setOptB({ ...BLANK, label: 'Option B' })
  }

  const compare = () => {
    setLoading(true); setResults(null); setAiInsight('')
    setTimeout(() => {
      const res = compareDecisions(toCompareParams(optA), toCompareParams(optB), cityKey)
      setResults(res); setLoading(false); setStage('results')
      fetchAiInsight(optA, optB, res, cityKey)
    }, 700)
  }

  const fetchAiInsight = async (a, b, res, city) => {
    setAiLoading(true)
    try {
      const prompt = `You are a financial life advisor helping someone compare two options.

Option A: ${a.label} — $${a.salary.toLocaleString()} salary, ${a.salaryGrowthRate}%/yr growth, $${a.monthlyExpenses.toLocaleString()}/mo expenses
Option B: ${b.label} — $${b.salary.toLocaleString()} salary, ${b.salaryGrowthRate}%/yr growth, $${b.monthlyExpenses.toLocaleString()}/mo expenses
City: ${city}
20-year winner: ${res.winner20yr === 'A' ? a.label : b.label}
Break-even: ${res.crossoverYear > 0 ? `Year ${res.crossoverYear}` : 'No crossover in 20 years'}

Write 3-4 sentences: which builds more wealth and why, what is the biggest risk of each, and what you would recommend. Be direct, specific, and use real numbers. No fluff.`

      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })
      const data = await r.json()
      setAiInsight(data.text || 'AI analysis unavailable.')
    } catch { setAiInsight('AI analysis unavailable. Check your ANTHROPIC_API_KEY in Railway.') }
    setAiLoading(false)
  }

  const chartData = results
    ? results.optionA.projections.map((a, i) => ({ year: a.year, [optA.label || 'Option A']: a.netWorth, [optB.label || 'Option B']: results.optionB.projections[i]?.netWorth || 0 }))
    : []

  //  STAGE: Question Tree 
  if (stage === 'tree') return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitFork size={18} color="#f97316" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: 0 }}>Decision Engine</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Compare any two life choices — see which builds more wealth over 20 years</p>
          </div>
        </div>
      </div>

      {path.length > 1 && (
        <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
          <ArrowLeft size={14} /> Go back
        </button>
      )}

      <div style={{ background: '#111111', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 6 }}>{currentNode.question}</h2>
        {currentNode.subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>{currentNode.subtitle}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          {currentNode.options.map((option, i) => (
            <button key={i} onClick={() => handleOption(option)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', borderRadius: 10, transition: 'all 0.2s', background: '#0d0d0d', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#0d0d0d' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{option.label}</div>
                {option.desc && <div style={{ fontSize: 12, color: '#4a3f35' }}>{option.desc}</div>}
              </div>
              <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  //  STAGE: Input Forms 
  if (stage === 'inputs') return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitFork size={18} color="#f97316" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: 0 }}>Decision Engine</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{scenarioLabel} — adjust the numbers to match your real situation, then compare</p>
          </div>
        </div>
      </div>

      <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
        <ArrowLeft size={14} /> Choose different scenario
      </button>

      <div style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
         <strong style={{ color: '#f97316' }}>These are starting estimates</strong> — change any number to match your real situation before comparing.
      </div>

      <div className="comparison-grid" style={{ marginBottom: 24 }}>
        <OptionForm data={optA} onChange={setOptA} color="#f97316" side="A" />
        <div className="vs-divider">VS</div>
        <OptionForm data={optB} onChange={setOptB} color="#f97316" side="B" />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}> City for cost-of-living context</div>
          <select value={cityKey} onChange={e => setCityKey(e.target.value)}>
            {Object.keys(CITIES).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" style={{ padding: '13px 36px', fontSize: 15 }} onClick={compare} disabled={loading || !optA.label || !optB.label}>
          {loading ? <><span className="spinner" /> Running...</> : <><GitFork size={16} /> Compare These Paths</>}
        </button>
      </div>

      {loading && (
        <div className="sim-loading" style={{ marginTop: 40 }}>
          <div className="spinner" style={{ width: 32, height: 32, borderTopColor: '#f97316' }} />
          <div className="sim-loading-text" style={{ color: '#f97316' }}>Simulating both life paths...</div>
        </div>
      )}
    </div>
  )

  //  STAGE: Results 
  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitFork size={18} color="#f97316" />
            </div>
            <div>
              <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: 0 }}>Results: {scenarioLabel}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{optA.label} vs {optB.label} · {cityKey}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}>
              <ArrowLeft size={14} /> Edit numbers
            </button>
            <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}>
              Start over
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { icon: '', label: 'Better After 5 Years', value: results.winner5yr === 'A' ? optA.label : optB.label, color: results.winner5yr === 'A' ? '#f97316' : '#f97316', sub: 'By net worth at year 5' },
            { icon: '', label: 'Better After 20 Years', value: results.winner20yr === 'A' ? optA.label : optB.label, color: results.winner20yr === 'A' ? '#f97316' : '#f97316', sub: 'By net worth at year 20' },
            { icon: '️', label: 'Break-Even Point', value: results.crossoverYear > 0 ? `Year ${results.crossoverYear}` : 'No crossover', color: '#fb923c', sub: results.crossoverYear > 0 ? 'When the paths cross' : 'One stays ahead throughout' },
            { icon: '', label: '20-Year Wealth Gap', value: formatCurrency(Math.abs((results.optionA.projections[20]?.netWorth || 0) - (results.optionB.projections[20]?.netWorth || 0))), color: '#f59e0b', sub: `In favor of ${results.winner20yr === 'A' ? optA.label : optB.label}` },
          ].map(kpi => (
            <div key={kpi.label} className="stat-card">
              <div style={{ fontSize: 20, marginBottom: 4 }}>{kpi.icon}</div>
              <div className="stat-label">{kpi.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
              <div className="stat-delta">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="panel">
          <div className="panel-header"><div className="panel-title"><TrendingUp size={15} color="#f97316" /> 20-Year Net Worth Comparison</div></div>
          <div className="panel-body">
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,115,22,0.07)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                  <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                  <Area type="monotone" dataKey={optA.label || 'Option A'} stroke="#f97316" fill="url(#gA)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey={optB.label || 'Option B'} stroke="#f97316" fill="url(#gB)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Market factors */}
        {results.marketFactors.length > 0 && (
          <div className="panel">
            <div className="panel-header"><div className="panel-title"><AlertTriangle size={15} color="#f59e0b" /> Things to Know About {cityKey}</div></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.marketFactors.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: f.impact === 'positive' ? 'rgba(5,150,105,0.05)' : 'rgba(249,115,22,0.05)', border: `1px solid ${f.impact === 'positive' ? 'rgba(5,150,105,0.15)' : 'rgba(249,115,22,0.15)'}`, borderRadius: 8 }}>
                  <div style={{ fontSize: 16 }}>{f.impact === 'positive' ? '' : '️'}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: f.impact === 'positive' ? '#4ade80' : '#f97316' }}>{f.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{f.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI */}
        <div className="panel" style={{ borderColor: 'rgba(249,115,22,0.2)' }}>
          <div className="panel-header">
            <div className="panel-title"><Sparkles size={15} color="#f97316" /> AI Life Advisor</div>
            {aiLoading && <div className="spinner" style={{ borderTopColor: '#f97316' }} />}
          </div>
          <div className="panel-body">
            {aiLoading && <div style={{ color: '#4a3f35', fontSize: 13, fontFamily: 'var(--font-mono)' }}>Analyzing your two paths...</div>}
            {aiInsight && <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 10, padding: '16px 20px' }}>{aiInsight}</div>}
          </div>
        </div>

        {/* Table */}
        <div className="panel">
          <div className="panel-header"><div className="panel-title"> Year-by-Year Net Worth</div></div>
          <div className="panel-body" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#4a3f35', fontWeight: 500 }}>Year</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', color: '#f97316' }}>{optA.label || 'Option A'}</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', color: '#f97316' }}>{optB.label || 'Option B'}</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', color: '#4a3f35', fontWeight: 500 }}>Difference</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', color: '#4a3f35', fontWeight: 500 }}>Leader</th>
                </tr>
              </thead>
              <tbody>
                {[1, 3, 5, 10, 15, 20].map(yr => {
                  const a = results.optionA.projections[yr]?.netWorth || 0
                  const b = results.optionB.projections[yr]?.netWorth || 0
                  const diff = a - b
                  const leader = diff > 0 ? 'A' : 'B'
                  return (
                    <tr key={yr} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Year {yr}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#f97316', fontWeight: leader === 'A' ? 700 : 400 }}>{formatCurrency(a)}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#f97316', fontWeight: leader === 'B' ? 700 : 400 }}>{formatCurrency(b)}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: diff > 0 ? '#f97316' : '#f97316' }}>{diff > 0 ? '+' : ''}{formatCurrency(diff)}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span className={`badge badge-${leader === 'A' ? 'cyan' : 'orange'}`}>{leader === 'A' ? (optA.label || 'A') : (optB.label || 'B')}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
