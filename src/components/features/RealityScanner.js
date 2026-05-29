'use client'
import React, { useState } from 'react'
import { ScanSearch, AlertCircle, TrendingUp, DollarSign, CheckCircle, Upload, Sparkles } from 'lucide-react'
import { CITIES, analyzeListingCost, formatCurrency } from '@/lib/financialEngine'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts'

const EXAMPLE_LISTINGS = [
  { label: ' 1BR Atlanta Apt', text: `Beautiful 1-bedroom apartment in Midtown Atlanta! $1,850/month. Pet-friendly building with rooftop access. Parking available for $100/month extra. Utilities NOT included. Modern kitchen, in-unit washer/dryer hookups only (coin laundry in basement). 12-month lease. $1,850 security deposit + first month required.` },
  { label: ' NYC Studio', text: `Sunny studio in Manhattan's East Village. $2,900/month. Walk-up building, 4th floor, no elevator. No pets. Heat and hot water included. Electric extra (~$80/mo). Application fee $75. Guarantor required if income under $87,000/year. Broker fee = 1 month rent.` },
  { label: ' House for Sale', text: `Beautiful 3BR/2BA home for sale in Austin TX. Listing price $485,000. HOA $220/month. Great schools, 2-car garage. Property taxes ~1.8% annually. Move-in ready condition. Seller will contribute up to $5,000 toward closing costs.` },
  { label: ' Influencer Lifestyle', text: `Dream lifestyle in Miami: luxury apartment $3,200/month, Tesla Model 3 lease, weekly brunch + nightlife, designer clothes budget, gym + SoulCycle, travel twice a year, Michelin-star dinners monthly, Whole Foods exclusively. Premium streaming services, personal trainer, and content creator setup.` },
]

const RISK_COLORS = { low: '#4ade80', medium: '#f59e0b', high: '#ef4444' }

function NumInput({ label, value, onChange, min, max, helper = '' }) {
  const [raw, setRaw] = useState(String(value));
  const [focused, setFocused] = useState(false);
  React.useEffect(() => { if (!focused) setRaw(String(value)); }, [value, focused]);
  const commit = () => {
    const p = parseFloat(raw.replace(/[^0-9.-]/g, ''));
    if (!isNaN(p)) { const c = Math.min(max, Math.max(min, p)); onChange(c); setRaw(String(c)); }
    else setRaw(String(value));
    setFocused(false);
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: '#111111', border: `1px solid ${focused ? '#f97316' : 'var(--border-bright)'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}>
        <span style={{ padding: '0 10px', color: '#4a3f35', fontFamily: 'var(--font-mono)', fontSize: 14, borderRight: '1px solid var(--border)' }}>$</span>
        <input type="text" value={raw} onFocus={() => { setFocused(true); setRaw(String(value)); }} onChange={e => setRaw(e.target.value)} onBlur={commit} onKeyDown={e => e.key === 'Enter' && commit()}
          style={{ flex: 1, padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, outline: 'none' }} />
        <span style={{ padding: '0 12px', color: '#4a3f35', fontSize: 13 }}>/year</span>
      </div>
      {helper && <div style={{ fontSize: 11, color: '#4a3f35', marginTop: 4 }}>{helper}</div>}
    </div>
  );
}

export default function RealityScanner() {
  const [listing, setListing] = useState('')
  const [income, setIncome] = useState(60000)
  const [cityKey, setCityKey] = useState('Atlanta, GA')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiInsight, setAiInsight] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const analyze = () => {
    if (!listing.trim()) return
    setLoading(true); setResults(null); setAiInsight('')
    setTimeout(() => {
      const r = analyzeListingCost(listing, income, cityKey)
      setResults(r); setLoading(false)
      fetchAiInsight(listing, r, income, cityKey)
    }, 700)
  }

  const fetchAiInsight = async (listingText, analysisResult, userIncome, city) => {
    setAiLoading(true)
    try {
      const prompt = `You are a brutally honest financial advisor analyzing a real estate/lifestyle listing for a young adult.

Listing: "${listingText.substring(0, 500)}"
City: ${city}
User annual income: $${userIncome.toLocaleString()}
Total estimated monthly cost: $${analysisResult.totalMonthly.toLocaleString()}
Required gross income to afford: $${analysisResult.requiredGrossIncome.toLocaleString()}
Affordability score: ${analysisResult.currentAffordability}%
Hidden costs: ${analysisResult.hiddenCosts.map(c => c.label).join(', ')}

Give a 3-4 sentence HONEST assessment. Can they afford this? What is the biggest financial risk? What would you tell a friend before they sign? End with one key recommendation. Be direct, use specific numbers, no fluff.`

      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })
      const data = await res.json()
      setAiInsight(data.text || 'AI analysis unavailable.')
    } catch (e) { setAiInsight('AI analysis unavailable. Check your API key in Railway.') }
    setAiLoading(false)
  }

  const affordabilityColor = results
    ? Math.min(100, results.currentAffordability) >= 100 ? '#4ade80' : Math.min(100, results.currentAffordability) >= 75 ? '#f59e0b' : Math.min(100, results.currentAffordability) >= 50 ? '#f97316' : '#ef4444'
    : 'var(--text-muted)'

  const radarData = results ? [
    { subject: 'Affordable', value: Math.min(100, results.currentAffordability) },
    { subject: 'Rent Burden', value: Math.max(0, 100 - (results.totalMonthly / (income / 12)) * 100) },
    { subject: 'Hidden Costs', value: Math.max(0, 100 - results.hiddenCosts.length * 15) },
    { subject: 'Market Risk', value: results.isForSale ? 40 : 65 },
    { subject: 'Income Cushion', value: Math.min(100, ((income / 12 - results.totalMonthly) / (income / 12)) * 100 + 50) },
  ] : []

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ScanSearch size={18} color="#fb923c" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: 0 }}>Reality Scanner</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Paste any listing or lifestyle — AI finds the real total cost and hidden fees</p>
          </div>
        </div>
      </div>

      <div className="split-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="panel">
            <div className="panel-header"><div className="panel-title"><Upload size={15} color="#fb923c" /> Paste the Listing or Description</div></div>
            <div className="panel-body">
              <textarea value={listing} onChange={e => setListing(e.target.value)} placeholder="Paste an apartment listing, a car ad, or describe a lifestyle here. For example: '2BR apartment in Austin, $2,200/month, parking $80/month extra, utilities not included...'" style={{ minHeight: 160, fontSize: 13 }} />
              <div style={{ marginTop: 12 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>Quick examples — click to try:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {EXAMPLE_LISTINGS.map(ex => (
                    <button key={ex.label} onClick={() => setListing(ex.text)} style={{ padding: '6px 14px', background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#fb923c'; e.currentTarget.style.color = '#fb923c'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title"><DollarSign size={15} color="#f97316" /> Your Situation</div></div>
            <div className="panel-body">
              <NumInput label=" Your Annual Income (before taxes)" value={income} onChange={setIncome} min={10000} max={500000} helper="We use this to calculate if you can afford it" />
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}> Your City</div>
                <select value={cityKey} onChange={e => setCityKey(e.target.value)}>
                  {Object.keys(CITIES).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button className="btn btn-purple" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={analyze} disabled={loading || !listing.trim()}>
            {loading ? <><span className="spinner" style={{ borderTopColor: 'white' }} /> Analyzing...</> : <><ScanSearch size={16} /> Scan Reality</>}
          </button>

          <div className="panel">
            <div className="panel-header"><div className="panel-title" style={{ fontSize: 13 }}>What the Scanner checks</div></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Actual monthly cost vs what is advertised',
                'Hidden fees (parking, HOA, utilities, broker fee)',
                'Income required after taxes to afford it',
                'How much your cost grows over 5–10 years',
                'Affordability score compared to your income',
                'Move-in / upfront one-time costs',
                'AI honest assessment of the whole situation',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <CheckCircle size={12} color="#fb923c" style={{ marginTop: 2, flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {loading && (
            <div className="sim-loading">
              <div className="spinner" style={{ width: 32, height: 32, borderTopColor: '#fb923c' }} />
              <div className="sim-loading-text" style={{ color: '#fb923c' }}>Scanning for hidden costs...</div>
            </div>
          )}

          {results && (
            <>
              {/* Affordability score */}
              <div className="panel">
                <div className="panel-header"><div className="panel-title"> Can You Afford This?</div></div>
                <div className="panel-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, color: affordabilityColor }}>{Math.min(100, results.currentAffordability)}%</div>
                      <div style={{ fontSize: 12, color: '#4a3f35', marginTop: 4, fontFamily: 'var(--font-mono)' }}>Affordability Score</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: affordabilityColor, marginBottom: 10 }}>
                        {Math.min(100, results.currentAffordability) >= 100 ? ' You can afford this comfortably'
                          : Math.min(100, results.currentAffordability) >= 75 ? '️ Tight, but possible with discipline'
                            : Math.min(100, results.currentAffordability) >= 50 ? '️ This will stretch your budget significantly'
                              : ' This exceeds what your income can safely support'}
                      </div>
                      <div className="affordability-meter">
                        <div className="affordability-fill" style={{ width: `${Math.min(100, results.currentAffordability)}%`, background: `linear-gradient(90deg, ${results.currentAffordability < 50 ? '#ef4444, #f97316' : results.currentAffordability < 75 ? '#f97316, #f59e0b' : '#f97316, #4ade80'})` }} />
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {[
                          { label: 'Total monthly cost', value: `${formatCurrency(results.totalMonthly)}/mo`, color: 'var(--text-primary)' },
                          { label: 'Income you need (gross)', value: `${formatCurrency(results.requiredGrossIncome)}/yr`, color: affordabilityColor },
                          { label: 'Your income', value: `${formatCurrency(income)}/yr`, color: 'var(--text-primary)' },
                          { label: income >= results.requiredGrossIncome ? 'You have a surplus of' : 'You are short by', value: income >= results.requiredGrossIncome ? `+${formatCurrency(income - results.requiredGrossIncome)}/yr` : `-${formatCurrency(results.requiredGrossIncome - income)}/yr`, color: income >= results.requiredGrossIncome ? '#4ade80' : '#ef4444' },
                        ].map(row => (
                          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, gap: 16 }}>
                            <span style={{ color: '#4a3f35' }}>{row.label}</span>
                            <span style={{ color: row.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden costs */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><AlertCircle size={15} color="#f97316" /> Hidden Costs Found</div>
                  <span className="badge badge-orange">{results.hiddenCosts.length} items</span>
                </div>
                <div className="panel-body">
                  {results.hiddenCosts.length === 0 && <div style={{ color: '#4a3f35', fontSize: 13 }}> No major hidden costs detected in this listing.</div>}
                  {results.hiddenCosts.map((cost, i) => (
                    <div key={i} className="cost-row">
                      <div className="cost-row-label">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: RISK_COLORS[cost.risk], flexShrink: 0 }} />
                        {cost.label}
                        <span className={`badge badge-${cost.risk === 'low' ? 'green' : cost.risk === 'medium' ? 'yellow' : 'red'}`}>{cost.risk === 'low' ? 'Low risk' : cost.risk === 'medium' ? 'Watch out' : 'High risk'}</span>
                      </div>
                      <div className="cost-row-value" style={{ color: RISK_COLORS[cost.risk] }}>
                        {cost.oneTime ? `${formatCurrency(cost.oneTime)} one-time` : `${formatCurrency(cost.monthly)}/mo`}
                      </div>
                    </div>
                  ))}
                  {results.lifestyle.length > 0 && (
                    <>
                      <div className="divider" />
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 10 }}>Estimated Living Expenses</div>
                      {results.lifestyle.map((cost, i) => (
                        <div key={i} className="cost-row">
                          <div className="cost-row-label">{cost.label}</div>
                          <div className="cost-row-value" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(cost.monthly)}/mo</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Market trajectory */}
              <div className="panel">
                <div className="panel-header"><div className="panel-title"><TrendingUp size={15} color="#f59e0b" /> How the Cost Grows Over Time</div></div>
                <div className="panel-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div style={{ background: '#0d0d0d', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#4a3f35', marginBottom: 4 }}>Current {results.isForSale ? 'Price' : 'Rent'}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18 }}>{formatCurrency(results.isForSale ? results.estimatedPrice : results.estimatedRent)}{!results.isForSale && <span style={{ fontSize: 12, color: '#4a3f35' }}>/mo</span>}</div>
                    </div>
                    <div style={{ background: '#0d0d0d', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#4a3f35', marginBottom: 4 }}>Projected in 5 Years</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18, color: '#f97316' }}>
                        {formatCurrency(results.isForSale ? results.projectedPriceIn5yr : results.projectedRentIn5yr)}{!results.isForSale && <span style={{ fontSize: 12 }}>/mo</span>}
                        <span style={{ fontSize: 11, color: '#f97316', marginLeft: 6 }}>
                          +{results.isForSale ? (((results.projectedPriceIn5yr/results.estimatedPrice)-1)*100).toFixed(0) : (((results.projectedRentIn5yr/results.estimatedRent)-1)*100).toFixed(0)}% more
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#0d0d0d', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                     Historical data for {results.city.label}: prices vary by ±{(results.city.rentGrowthMargin * 100).toFixed(0)}% from the average — actual results may differ.
                  </div>
                  {results.estimatedRent > 0 && (
                    <div style={{ height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { label: 'Today', value: results.estimatedRent },
                          { label: '2 yrs', value: results.estimatedRent * Math.pow(1 + results.city.rentGrowthRate, 2) },
                          { label: '5 yrs', value: results.estimatedRent * Math.pow(1 + results.city.rentGrowthRate, 5) },
                          { label: '10 yrs', value: results.estimatedRent * Math.pow(1 + results.city.rentGrowthRate, 10) },
                        ]} barSize={40}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,115,22,0.07)" />
                          <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                          <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                          <Tooltip formatter={v => [formatCurrency(v), 'Monthly Rent']} contentStyle={{ background: '#111111', border: '1px solid var(--border-bright)', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
                          <Bar dataKey="value" radius={[4,4,0,0]}>{[0,1,2,3].map(i => <Cell key={i} fill={`rgba(99,102,241,${0.4 + i * 0.2})`} />)}</Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Insight */}
              <div className="panel" style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
                <div className="panel-header">
                  <div className="panel-title"><Sparkles size={15} color="#fb923c" /> AI Honest Assessment</div>
                  {aiLoading && <div className="spinner" style={{ borderTopColor: '#fb923c' }} />}
                </div>
                <div className="panel-body">
                  {aiLoading && <div style={{ color: '#4a3f35', fontSize: 13, fontFamily: 'var(--font-mono)' }}>Generating honest assessment...</div>}
                  {aiInsight && (
                    <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '16px 20px' }}>
                      {aiInsight}
                    </div>
                  )}
                </div>
              </div>

              {/* Radar */}
              {radarData.length > 0 && (
                <div className="panel">
                  <div className="panel-header"><div className="panel-title"> Financial Health Overview</div></div>
                  <div className="panel-body" style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} cx="50%" cy="50%">
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                        <Radar name="Score" dataKey="value" stroke="#fb923c" fill="#fb923c" fillOpacity={0.15} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}

          {!results && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', color: '#4a3f35', textAlign: 'center' }}>
              <ScanSearch size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>Paste a listing on the left to reveal its true cost</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>Apartments, houses, cars, or any lifestyle — we will break down every dollar</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
