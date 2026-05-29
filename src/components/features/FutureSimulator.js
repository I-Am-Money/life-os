'use client'
import React, { useState, useCallback, useEffect } from 'react';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { BarChart2, TrendingUp, DollarSign, Heart, Target, Calendar } from 'lucide-react';
import {
  CITIES, ECONOMIC_SCENARIOS,
  simulateFinancialFuture, formatCurrency, getStressLabel,
} from '@/lib/financialEngine';

const LIFESTYLE_OPTS = [
  { value: 'frugal', label: ' Minimal', desc: 'Low spending, save more' },
  { value: 'moderate', label: '️ Average', desc: 'Balanced lifestyle' },
  { value: 'lavish', label: ' High', desc: 'Enjoy life fully' },
];
const CAR_OPTS = [
  { value: 'none', label: ' No Car', desc: '$0/mo' },
  { value: 'cheap', label: ' Budget', desc: '~$200/mo' },
  { value: 'mid', label: ' Mid-Range', desc: '~$500/mo' },
  { value: 'luxury', label: '️ Luxury', desc: '~$1,100/mo' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#111111', border: '1px solid var(--border-bright)', borderRadius: 10, padding: '12px 16px', fontSize: 12, fontFamily: 'var(--font-mono)', minWidth: 180 }}>
        <div style={{ color: '#4a3f35', marginBottom: 8 }}>Year {label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, marginBottom: 4 }}>
            {p.name}: {p.name === 'Stress' ? p.value + '%' : formatCurrency(p.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function NumInput({ label, value, onChange, min, max, prefix = '$', suffix = '', helper = '' }) {
  const [raw, setRaw] = useState(String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => { if (!focused) setRaw(String(value)); }, [value, focused]);
  const commit = () => {
    const parsed = parseFloat(raw.replace(/[^0-9.-]/g, ''));
    if (!isNaN(parsed)) { const c = Math.min(max, Math.max(min, parsed)); onChange(c); setRaw(String(c)); }
    else setRaw(String(value));
    setFocused(false);
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', background: '#111111', border: `1px solid ${focused ? '#f97316' : 'var(--border-bright)'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}>
        {prefix && <span style={{ padding: '0 10px', color: '#4a3f35', fontFamily: 'var(--font-mono)', fontSize: 14, borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{prefix}</span>}
        <input type="text" value={raw} onFocus={() => { setFocused(true); setRaw(String(value)); }} onChange={e => setRaw(e.target.value)} onBlur={commit} onKeyDown={e => e.key === 'Enter' && commit()}
          style={{ flex: 1, padding: '10px 12px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, outline: 'none' }} />
        {suffix && <span style={{ padding: '0 12px', color: '#4a3f35', fontSize: 13 }}>{suffix}</span>}
      </div>
      {helper && <div style={{ fontSize: 11, color: '#4a3f35', marginTop: 4 }}>{helper}</div>}
    </div>
  );
}

export default function FutureSimulator() {
  const [params, setParams] = useState({
    salary: 65000, cityKey: 'Atlanta, GA', monthlyDebt: 200, hasRoommate: false,
    investmentRate: 0.3, lifestyle: 'moderate', carType: 'mid', hasEmergencyFund: true,
    currentSavings: 5000, studentLoanBalance: 28000, economicScenario: 'baseline',
  });
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('wealth');
  const [running, setRunning] = useState(false);
  const [showYears, setShowYears] = useState(20);

  const runSimulation = useCallback(() => {
    setRunning(true);
    setTimeout(() => { const res = simulateFinancialFuture(params, showYears); setResults(res); setRunning(false); }, 600);
  }, [params, showYears]);

  useEffect(() => { runSimulation(); }, []);
  const set = (key, val) => setParams(p => ({ ...p, [key]: val }));

  const current = results?.projections?.[0];
  const future10 = results?.projections?.[10];
  const future20 = results?.projections?.[Math.min(20, (results?.projections?.length || 1) - 1)];
  const chartData = results?.projections?.map(p => ({ year: p.year, 'Net Worth': p.netWorth, 'Savings': p.savings, 'Investments': p.investments, 'Stress': p.stressLevel, 'Salary': p.salary }));
  const stressInfo = current ? getStressLabel(current.stressLevel) : null;

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(59,110,240,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={18} color="#f97316" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.8rem', marginBottom: 0 }}>Future Simulator</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Enter your numbers — see your financial life up to {showYears} years from now</p>
          </div>
        </div>
      </div>

      <div className="split-layout">
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="panel">
            <div className="panel-header"><div className="panel-title"><DollarSign size={15} color="#f97316" /> Your Money</div></div>
            <div className="panel-body">
              <NumInput label=" Annual Salary (before taxes)" value={params.salary} onChange={v => set('salary', v)} min={10000} max={500000} helper="How much you earn per year" />
              <NumInput label=" Current Savings" value={params.currentSavings} onChange={v => set('currentSavings', v)} min={0} max={500000} helper="Money you already have saved" />
              <NumInput label=" Student Loan Balance" value={params.studentLoanBalance} onChange={v => set('studentLoanBalance', v)} min={0} max={200000} helper="Total student debt remaining (enter 0 if none)" />
              <NumInput label=" Other Monthly Debt Payments" value={params.monthlyDebt} onChange={v => set('monthlyDebt', v)} min={0} max={5000} prefix="" suffix="/month" helper="Credit cards, personal loans, car payments, etc." />
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}> Your City</div>
                <select value={params.cityKey} onChange={e => set('cityKey', e.target.value)}>
                  {Object.keys(CITIES).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              {results && (
                <div style={{ background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 16px' }}>
                  <span style={{ color: '#4a3f35' }}>Average 1BR rent</span><span style={{ color: '#f97316', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{formatCurrency(results.city.medianRent1BR)}/mo</span>
                  <span style={{ color: '#4a3f35' }}>State tax</span><span style={{ color: results.city.stateTax === 0 ? '#4ade80' : 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{results.city.stateTax === 0 ? 'No tax! ' : (results.city.stateTax * 100).toFixed(1) + '%'}</span>
                  <span style={{ color: '#4a3f35' }}>Rent grows ~</span><span style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{results.summary.yearlyGrowthRange}/yr</span>
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title"><TrendingUp size={15} color="#fb923c" /> Investing</div></div>
            <div className="panel-body">
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, fontWeight: 500 }}> How much of your leftover money do you invest?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                {[{l:'10%',v:0.1,d:'Just starting'},{l:'20%',v:0.2,d:'Moderate'},{l:'30%',v:0.3,d:'Good habit'},{l:'50%',v:0.5,d:'Aggressive'}].map(o => (
                  <button key={o.v} onClick={() => set('investmentRate', o.v)} style={{ padding: 10, textAlign: 'center', cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s', background: params.investmentRate === o.v ? 'rgba(99,102,241,0.15)' : '#0d0d0d', border: `1px solid ${params.investmentRate === o.v ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`, color: params.investmentRate === o.v ? '#fb923c' : 'var(--text-secondary)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{o.l}</div>
                    <div style={{ fontSize: 10, opacity: 0.7 }}>{o.d}</div>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#4a3f35' }}> Experts recommend investing at least 15–20% of income for a comfortable retirement.</div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title"><Heart size={15} color="#ef4444" /> Lifestyle</div></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}> Spending Style</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {LIFESTYLE_OPTS.map(o => (
                    <button key={o.value} onClick={() => set('lifestyle', o.value)} style={{ flex: 1, padding: '10px 6px', textAlign: 'center', cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s', background: params.lifestyle === o.value ? 'rgba(255,45,120,0.12)' : '#0d0d0d', border: `1px solid ${params.lifestyle === o.value ? 'rgba(255,45,120,0.35)' : 'var(--border)'}`, color: params.lifestyle === o.value ? '#ef4444' : 'var(--text-secondary)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{o.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.7 }}>{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}> Car / Transport</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {CAR_OPTS.map(o => (
                    <button key={o.value} onClick={() => set('carType', o.value)} style={{ padding: 10, textAlign: 'center', cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s', background: params.carType === o.value ? 'rgba(245,158,11,0.12)' : '#0d0d0d', border: `1px solid ${params.carType === o.value ? 'rgba(245,158,11,0.35)' : 'var(--border)'}`, color: params.carType === o.value ? '#f59e0b' : 'var(--text-secondary)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{o.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.7 }}>{o.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              {[
                { key: 'hasRoommate', label: ' I have / will get a roommate', desc: 'Splits rent — saves ~$600–$1,000/month', color: '#f97316' },
                { key: 'hasEmergencyFund', label: ' Building an emergency fund', desc: 'Goal: 6 months of expenses saved', color: '#fb923c' },
              ].map(({ key, label, desc, color }) => (
                <div key={key} onClick={() => set(key, !params[key])} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s', background: params[key] ? `${color}10` : '#0d0d0d', border: `1px solid ${params[key] ? color + '30' : 'var(--border)'}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: params[key] ? color : 'var(--text-secondary)' }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#4a3f35', marginTop: 2 }}>{desc}</div>
                  </div>
                  <div style={{ width: 40, height: 22, background: params[key] ? color : '#1a1a1a', borderRadius: 11, position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: params[key] ? 21 : 3, width: 16, height: 16, background: '#111111', borderRadius: '50%', transition: 'left 0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title"><TrendingUp size={15} color="#f59e0b" /> Economy Scenario</div></div>
            <div className="panel-body">
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>How do you think the economy will do?</div>
              <div className="scenario-toggle">
                {Object.entries(ECONOMIC_SCENARIOS).map(([key, s]) => (
                  <button key={key} className={`scenario-btn ${params.economicScenario === key ? 'active' : ''}`} onClick={() => set('economicScenario', key)}>{s.label}</button>
                ))}
              </div>
              {params.economicScenario && (
                <div style={{ marginTop: 12, background: '#0d0d0d', borderRadius: 8, padding: '10px 14px', fontSize: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                  {[[' Inflation', `${(ECONOMIC_SCENARIOS[params.economicScenario].inflationRate*100).toFixed(1)}%/yr`],[' Stock returns',`${(ECONOMIC_SCENARIOS[params.economicScenario].stockMarketReturn*100).toFixed(0)}%/yr`],[' Salary growth',`${(ECONOMIC_SCENARIOS[params.economicScenario].salaryGrowthRate*100).toFixed(1)}%/yr`],['️ Recession risk',`${(ECONOMIC_SCENARIOS[params.economicScenario].recession5yr*100).toFixed(0)}% in 5 yrs`]].map(([l,v]) => (
                    <React.Fragment key={l}><span style={{ color: '#4a3f35' }}>{l}</span><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{v}</span></React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title"><Calendar size={15} color="#fb923c" /> How Far Ahead?</div></div>
            <div className="panel-body">
              <div style={{ display: 'flex', gap: 8 }}>
                {[10, 20, 30].map(y => (
                  <button key={y} onClick={() => setShowYears(y)} style={{ flex: 1, padding: 10, cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: showYears === y ? 700 : 400, background: showYears === y ? 'rgba(99,102,241,0.1)' : '#0d0d0d', border: `1px solid ${showYears === y ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`, color: showYears === y ? '#fb923c' : 'var(--text-secondary)' }}>{y} years</button>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }} onClick={runSimulation} disabled={running}>
            {running ? <><span className="spinner" /> Simulating...</> : <><Target size={16} /> Run Simulation</>}
          </button>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {running ? (
            <div className="sim-loading"><div className="spinner" style={{ width: 32, height: 32 }} /><div className="sim-loading-text">Running your simulation...</div></div>
          ) : results ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                {[
                  { icon: '', label: 'Your Net Worth Right Now', value: formatCurrency(current?.netWorth), sub: current?.netWorth < 0 ? '️ You owe more than you own' : ' Your starting position', color: current?.netWorth >= 0 ? '#f97316' : '#ef4444' },
                  { icon: '', label: 'Net Worth in 10 Years', value: formatCurrency(future10?.netWorth), sub: future10?.netWorth > (current?.netWorth||0) ? ' Growing over time' : ' Needs improvement', color: '#ffffff' },
                  { icon: '️', label: 'Estimated Retirement Age', value: results.retirementYear ? `Age ${results.retirementYear}` : 'After 65', sub: results.retirementYear ? `~${results.retirementYear - 22} years from now` : 'Invest more to retire earlier', color: results.retirementYear && results.retirementYear < 55 ? '#4ade80' : '#f59e0b' },
                  { icon: '', label: 'Financial Stress (Year 1)', value: stressInfo?.label, sub: `Score: ${current?.stressLevel}/100 — lower is better`, color: stressInfo?.color },
                ].map(kpi => (
                  <div key={kpi.label} className="stat-card">
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{kpi.icon}</div>
                    <div className="stat-label" style={{ color: '#ffffff' }}>{kpi.label}</div>
                    <div className="stat-value" style={{ color: kpi.color, fontSize: '1.3rem' }}>{kpi.value}</div>
                    <div className="stat-delta" style={{ color: '#ffffff' }}>{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {current && (
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title"><DollarSign size={15} color="#f97316" /> Where Your Money Goes Each Month</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="info-chip">Tax: {current.effectiveTaxRate}%</span>
                      {current.cashFlow >= 0
                        ? <span className="badge badge-green">+{formatCurrency(current.cashFlow)}/mo left over</span>
                        : <span className="badge badge-red">{formatCurrency(current.cashFlow)}/mo short</span>}
                    </div>
                  </div>
                  <div className="panel-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                      {Object.entries(current.breakdown).map(([key, val]) => {
                        const meta = { rent:{l:' Rent',c:'#f97316'}, food:{l:' Food',c:'#f97316'}, transport:{l:' Transport',c:'#f59e0b'}, entertainment:{l:' Fun',c:'#ef4444'}, utilities:{l:' Utilities',c:'#fb923c'}, debt:{l:' Debt',c:'#ef4444'}, healthcare:{l:' Health',c:'#4ade80'}, misc:{l:' Other',c:'#888'} };
                        const m = meta[key] || { l: key, c: 'var(--text-muted)' };
                        return (
                          <div key={key} style={{ background: '#0d0d0d', borderRadius: 8, padding: '10px 12px', borderLeft: `3px solid ${m.c}` }}>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{m.l}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: m.c }}>{formatCurrency(val)}</div>
                            <div style={{ fontSize: 10, color: '#4a3f35', marginTop: 2 }}>{((val / current.netMonthly) * 100).toFixed(0)}% of pay</div>
                          </div>
                        );
                      })}
                    </div>
                    {current.cashFlow < 0 && <div className="insight danger" style={{ marginTop: 16 }}><strong>️ Spending more than you earn:</strong> You are {formatCurrency(Math.abs(current.cashFlow))} over budget each month. Try getting a roommate, switching to a cheaper car, or increasing your income.</div>}
                    {current.debtToIncome > 70 && <div className="insight warning" style={{ marginTop: 8 }}><strong> High debt:</strong> {current.debtToIncome}% of your income goes to debt. Advisors recommend staying under 36%. Consider paying it down faster.</div>}
                    {params.hasRoommate && <div className="insight" style={{ marginTop: 8 }}><strong> Roommate benefit:</strong> Sharing rent saves you ~{formatCurrency(results.city.medianRent1BR * 0.5)}/month — that is {formatCurrency(results.city.medianRent1BR * 6)} more savings per year.</div>}
                  </div>
                </div>
              )}

              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title"><TrendingUp size={15} color="#f97316" /> {showYears}-Year Projection Chart</div>
                  <div className="tabs" style={{ fontSize: 12 }}>
                    {[{id:'wealth',l:' Wealth'},{id:'stress',l:' Stress'},{id:'income',l:' Income'}].map(t => (
                      <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.l}</button>
                    ))}
                  </div>
                </div>
                <div className="panel-body">
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {activeTab === 'wealth' ? (
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="nwG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient>
                            <linearGradient id="invG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/><stop offset="95%" stopColor="#fb923c" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,115,22,0.07)" />
                          <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                          <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                          <Area type="monotone" dataKey="Net Worth" stroke="#f97316" fill="url(#nwG)" strokeWidth={2} />
                          <Area type="monotone" dataKey="Investments" stroke="#fb923c" fill="url(#invG)" strokeWidth={2} />
                          <Area type="monotone" dataKey="Savings" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                        </AreaChart>
                      ) : activeTab === 'stress' ? (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,115,22,0.07)" />
                          <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="Stress" stroke="#ef4444" strokeWidth={2} dot={false} />
                        </LineChart>
                      ) : (
                        <AreaChart data={chartData}>
                          <defs><linearGradient id="salG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,115,22,0.07)" />
                          <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                          <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="Salary" stroke="#f97316" fill="url(#salG)" strokeWidth={2} />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  <div style={{ marginTop: 12, background: '#0d0d0d', borderRadius: 8, padding: '10px 14px', fontSize: 11, color: '#4a3f35', fontFamily: 'var(--font-mono)' }}>
                     {params.cityKey}: Rent +{results.summary.yearlyGrowthRange}/yr · Home prices +{results.summary.homePriceGrowth}/yr · Recession risk: {(ECONOMIC_SCENARIOS[params.economicScenario].recession5yr*100).toFixed(0)}% in 5 yrs
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header"><div className="panel-title"><Target size={15} color="#f59e0b" /> Retirement Goal</div></div>
                <div className="panel-body">
                  <div className="grid-2">
                    <div>
                      <div className="section-label">How much you need saved to retire</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{formatCurrency(results.retirementTarget)}</div>
                      <div style={{ fontSize: 12, color: '#4a3f35', marginTop: 4 }}>Based on your projected future salary (4% rule)</div>
                    </div>
                    <div>
                      <div className="section-label">When you can retire</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: results.retirementYear && results.retirementYear < 55 ? '#4ade80' : '#f97316' }}>
                        {results.retirementYear ? `Age ${results.retirementYear}` : 'After age 52'}
                      </div>
                      <div style={{ fontSize: 12, color: '#4a3f35', marginTop: 4 }}>{results.retirementYear ? ' On track!' : '️ Invest more to retire earlier'}</div>
                    </div>
                  </div>
                  {future20 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                        <span>Progress at year {showYears}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#f97316' }}>{Math.min(100, Math.round((future20.investments / results.retirementTarget) * 100))}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${Math.min(100, (future20.investments / results.retirementTarget) * 100)}%`, background: 'linear-gradient(90deg, #f97316, #fb923c)' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
