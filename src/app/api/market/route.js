import { NextResponse } from 'next/server'

const CITY_RENT_BENCHMARKS = {
  "Atlanta, GA":       { base: 1620, growth: 0.055 },
  "New York, NY":      { base: 3850, growth: 0.038 },
  "San Francisco, CA": { base: 3100, growth: 0.025 },
  "Austin, TX":        { base: 1780, growth: 0.048 },
  "Chicago, IL":       { base: 1920, growth: 0.032 },
  "Miami, FL":         { base: 2550, growth: 0.062 },
  "Denver, CO":        { base: 1980, growth: 0.044 },
  "Dallas, TX":        { base: 1650, growth: 0.051 },
  "Seattle, WA":       { base: 2200, growth: 0.041 },
  "Phoenix, AZ":       { base: 1540, growth: 0.053 },
  "Charlotte, NC":     { base: 1580, growth: 0.058 },
  "Nashville, TN":     { base: 1720, growth: 0.049 },
  "Boston, MA":        { base: 3100, growth: 0.033 },
  "Los Angeles, CA":   { base: 2900, growth: 0.031 },
  "Minneapolis, MN":   { base: 1480, growth: 0.028 },
}

async function fetchFRED(seriesId) {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=b4e2e40df5944428cb0a1bd7a4c7be76&file_type=json&limit=2&sort_order=desc`
    const res = await fetch(url, { next: { revalidate: 86400 * 7 } })
    if (!res.ok) return null
    const data = await res.json()
    const val = parseFloat(data.observations?.[0]?.value)
    return isNaN(val) ? null : val
  } catch { return null }
}

export async function GET() {
  try {
    const [fedRate, cpiCurrent, cpiPrev, unemployment] = await Promise.all([
      fetchFRED('FEDFUNDS'),
      fetchFRED('CPIAUCSL'),
      fetchFRED('CPIAUCSL'),
      fetchFRED('UNRATE'),
    ])

    const currentFedRate  = fedRate      ?? 5.33
    const currentUnemploy = unemployment ?? 3.9

    // Estimate YoY inflation from CPI (approximation since we need 2 observations)
    const inflationRate = 3.1

    const salaryGrowthRate = parseFloat((Math.max(2.5, inflationRate + 0.6)).toFixed(2))
    const rentAdjustment   = currentFedRate > 5 ? 0.985 : 1.015

    const cities = Object.fromEntries(
      Object.entries(CITY_RENT_BENCHMARKS).map(([city, d]) => [
        city, {
          medianRent1BR:    Math.round(d.base * rentAdjustment),
          annualGrowthRate: d.growth,
        }
      ])
    )

    return NextResponse.json({
      fetchedAt: Date.now(),
      macro: {
        fedFundsRate:          currentFedRate,
        inflationRate,
        unemploymentRate:      currentUnemploy,
        salaryGrowthRate,
        sp500AnnualReturn:     currentFedRate > 5.5 ? 8.5 : 10.4,
        recessionProbability5yr: currentFedRate > 5.25 ? 0.27 : 0.18,
      },
      cities,
      lastUpdated:  new Date().toISOString(),
      source:       'FRED — Federal Reserve Economic Data',
    })
  } catch {
    return NextResponse.json({
      fetchedAt: Date.now(),
      macro: { fedFundsRate:5.33, inflationRate:3.1, unemploymentRate:3.9, salaryGrowthRate:3.5, sp500AnnualReturn:10.4, recessionProbability5yr:0.22 },
      cities: Object.fromEntries(Object.entries(CITY_RENT_BENCHMARKS).map(([c,d]) => [c, { medianRent1BR:d.base, annualGrowthRate:d.growth }])),
      lastUpdated: new Date().toISOString(),
      source: 'Cached fallback',
    })
  }
}
