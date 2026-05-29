// Market data & economic constants for LifeOS
// These represent real-world approximations with margin-of-error ranges

export const CITIES = {
  "Atlanta, GA": {
    costIndex: 1.0,
    medianRent1BR: 1650,
    medianHomePricePerSqft: 220,
    homePriceGrowthRate: 0.08, // 8% YoY
    homePriceGrowthMargin: 0.04,
    stateTax: 0.055,
    jobGrowthRate: 0.035,
    unemployment: 0.038,
    groceriesIndex: 0.97,
    transportIndex: 1.0,
    rentGrowthRate: 0.06,
    rentGrowthMargin: 0.025,
    avgSalaryMultiplier: 1.0,
    label: "Atlanta, GA",
  },
  "New York, NY": {
    costIndex: 1.9,
    medianRent1BR: 3800,
    medianHomePricePerSqft: 1200,
    homePriceGrowthRate: 0.04,
    homePriceGrowthMargin: 0.03,
    stateTax: 0.0685,
    jobGrowthRate: 0.02,
    unemployment: 0.042,
    groceriesIndex: 1.3,
    transportIndex: 1.1,
    rentGrowthRate: 0.04,
    rentGrowthMargin: 0.02,
    avgSalaryMultiplier: 1.45,
    label: "New York, NY",
  },
  "San Francisco, CA": {
    costIndex: 2.1,
    medianRent1BR: 3200,
    medianHomePricePerSqft: 1100,
    homePriceGrowthRate: 0.03,
    homePriceGrowthMargin: 0.05,
    stateTax: 0.093,
    jobGrowthRate: 0.025,
    unemployment: 0.035,
    groceriesIndex: 1.2,
    transportIndex: 1.05,
    rentGrowthRate: 0.03,
    rentGrowthMargin: 0.04,
    avgSalaryMultiplier: 1.7,
    label: "San Francisco, CA",
  },
  "Austin, TX": {
    costIndex: 1.15,
    medianRent1BR: 1900,
    medianHomePricePerSqft: 320,
    homePriceGrowthRate: 0.07,
    homePriceGrowthMargin: 0.05,
    stateTax: 0.0,
    jobGrowthRate: 0.05,
    unemployment: 0.03,
    groceriesIndex: 1.0,
    transportIndex: 1.05,
    rentGrowthRate: 0.065,
    rentGrowthMargin: 0.035,
    avgSalaryMultiplier: 1.1,
    label: "Austin, TX",
  },
  "Chicago, IL": {
    costIndex: 1.1,
    medianRent1BR: 1900,
    medianHomePricePerSqft: 260,
    homePriceGrowthRate: 0.045,
    homePriceGrowthMargin: 0.03,
    stateTax: 0.0495,
    jobGrowthRate: 0.02,
    unemployment: 0.045,
    groceriesIndex: 1.05,
    transportIndex: 1.0,
    rentGrowthRate: 0.04,
    rentGrowthMargin: 0.025,
    avgSalaryMultiplier: 1.05,
    label: "Chicago, IL",
  },
  "Miami, FL": {
    costIndex: 1.3,
    medianRent1BR: 2600,
    medianHomePricePerSqft: 550,
    homePriceGrowthRate: 0.09,
    homePriceGrowthMargin: 0.05,
    stateTax: 0.0,
    jobGrowthRate: 0.04,
    unemployment: 0.033,
    groceriesIndex: 1.05,
    transportIndex: 1.1,
    rentGrowthRate: 0.08,
    rentGrowthMargin: 0.04,
    avgSalaryMultiplier: 0.95,
    label: "Miami, FL",
  },
  "Denver, CO": {
    costIndex: 1.2,
    medianRent1BR: 2100,
    medianHomePricePerSqft: 430,
    homePriceGrowthRate: 0.06,
    homePriceGrowthMargin: 0.04,
    stateTax: 0.0455,
    jobGrowthRate: 0.04,
    unemployment: 0.031,
    groceriesIndex: 1.02,
    transportIndex: 1.0,
    rentGrowthRate: 0.055,
    rentGrowthMargin: 0.03,
    avgSalaryMultiplier: 1.1,
    label: "Denver, CO",
  },
  "Seattle, WA": {
    costIndex: 1.5,
    medianRent1BR: 2400,
    medianHomePricePerSqft: 650,
    homePriceGrowthRate: 0.05,
    homePriceGrowthMargin: 0.04,
    stateTax: 0.0,
    jobGrowthRate: 0.035,
    unemployment: 0.032,
    groceriesIndex: 1.1,
    transportIndex: 1.05,
    rentGrowthRate: 0.05,
    rentGrowthMargin: 0.03,
    avgSalaryMultiplier: 1.35,
    label: "Seattle, WA",
  },
  "Nashville, TN": {
    costIndex: 1.05,
    medianRent1BR: 1750,
    medianHomePricePerSqft: 280,
    homePriceGrowthRate: 0.075,
    homePriceGrowthMargin: 0.04,
    stateTax: 0.0,
    jobGrowthRate: 0.045,
    unemployment: 0.028,
    groceriesIndex: 0.96,
    transportIndex: 1.0,
    rentGrowthRate: 0.07,
    rentGrowthMargin: 0.035,
    avgSalaryMultiplier: 0.95,
    label: "Nashville, TN",
  },
  "Phoenix, AZ": {
    costIndex: 1.0,
    medianRent1BR: 1600,
    medianHomePricePerSqft: 280,
    homePriceGrowthRate: 0.065,
    homePriceGrowthMargin: 0.045,
    stateTax: 0.025,
    jobGrowthRate: 0.04,
    unemployment: 0.036,
    groceriesIndex: 0.98,
    transportIndex: 1.05,
    rentGrowthRate: 0.06,
    rentGrowthMargin: 0.035,
    avgSalaryMultiplier: 0.92,
    label: "Phoenix, AZ",
  },
};

export const ECONOMIC_SCENARIOS = {
  baseline: {
    label: "Baseline",
    inflationRate: 0.03,
    stockMarketReturn: 0.1,
    salaryGrowthRate: 0.035,
    recession2yr: 0.15,
    recession5yr: 0.35,
    interestRateTrend: "stable",
  },
  optimistic: {
    label: "Bull Market",
    inflationRate: 0.022,
    stockMarketReturn: 0.13,
    salaryGrowthRate: 0.05,
    recession2yr: 0.05,
    recession5yr: 0.18,
    interestRateTrend: "falling",
  },
  pessimistic: {
    label: "Bear Market",
    inflationRate: 0.045,
    stockMarketReturn: 0.06,
    salaryGrowthRate: 0.02,
    recession2yr: 0.35,
    recession5yr: 0.6,
    interestRateTrend: "rising",
  },
};

export const FEDERAL_TAX_BRACKETS_2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 },
];

export const FICA_RATE = 0.0765; // Social Security + Medicare (employee portion)
export const STANDARD_DEDUCTION = 13850;

export function calculateFederalTax(income) {
  const taxableIncome = Math.max(0, income - STANDARD_DEDUCTION);
  let tax = 0;
  for (const bracket of FEDERAL_TAX_BRACKETS_2024) {
    if (taxableIncome <= bracket.min) break;
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
  return tax;
}

export function calculateTotalTax(grossIncome, stateTaxRate) {
  const federalTax = calculateFederalTax(grossIncome);
  const fica = grossIncome * FICA_RATE;
  const stateTax = grossIncome * stateTaxRate;
  const totalTax = federalTax + fica + stateTax;
  return {
    federal: federalTax,
    fica,
    state: stateTax,
    total: totalTax,
    effectiveRate: totalTax / grossIncome,
    netIncome: grossIncome - totalTax,
  };
}

// Simulate financial trajectory over N years
export function simulateFinancialFuture(params, years = 30) {
  const {
    salary,
    cityKey,
    monthlyDebt,
    hasRoommate,
    investmentRate, // fraction of take-home invested
    lifestyle, // 'frugal' | 'moderate' | 'lavish'
    carType, // 'none' | 'cheap' | 'mid' | 'luxury'
    hasEmergencyFund,
    currentSavings,
    studentLoanBalance,
    economicScenario = 'baseline',
  } = params;

  const city = CITIES[cityKey] || CITIES["Atlanta, GA"];
  const econ = ECONOMIC_SCENARIOS[economicScenario];

  const lifestyleMultiplier = { frugal: 0.7, moderate: 1.0, lavish: 1.5 }[lifestyle] || 1.0;
  const carCost = { none: 0, cheap: 200, mid: 500, luxury: 1100 }[carType] || 0;

  const results = [];
  let savings = currentSavings || 0;
  let investments = 0;
  let studentLoan = studentLoanBalance || 0;
  let emergencyFund = hasEmergencyFund ? salary * 0.05 : 0;

  let currentSalary = salary;
  let currentRent = (hasRoommate ? 0.5 : 1.0) * city.medianRent1BR;
  let stressLevel = 50;

  for (let year = 0; year <= years; year++) {
    // Tax calculation
    const taxes = calculateTotalTax(currentSalary, city.stateTax);
    const monthlyNet = taxes.netIncome / 12;

    // Monthly expenses
    const monthlyRent = currentRent;
    const monthlyGroceries = 400 * city.groceriesIndex * lifestyleMultiplier;
    const monthlyTransport = (carCost + 150) * city.transportIndex;
    const monthlyEntertainment = 300 * lifestyleMultiplier;
    const monthlyUtilities = 150 * city.costIndex;
    const monthlySubscriptions = 80;
    const monthlyMisc = 200 * lifestyleMultiplier;
    const monthlyDebtPayment = monthlyDebt || 0;
    const monthlyStudentLoanPayment = studentLoan > 0 ? Math.min(studentLoan / 120, 500) : 0;
    const monthlyHealthcare = 250;

    const totalMonthlyExpenses =
      monthlyRent + monthlyGroceries + monthlyTransport + monthlyEntertainment +
      monthlyUtilities + monthlySubscriptions + monthlyMisc + monthlyDebtPayment +
      monthlyStudentLoanPayment + monthlyHealthcare;

    const monthlyCashFlow = monthlyNet - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // Investment contributions
    const monthlyInvestment = Math.max(0, monthlyCashFlow * investmentRate);
    const monthlyToSavings = Math.max(0, monthlyCashFlow * (1 - investmentRate));

    // Update balances
    savings += monthlyToSavings * 12;
    investments = investments * (1 + econ.stockMarketReturn) + monthlyInvestment * 12;
    studentLoan = Math.max(0, studentLoan - monthlyStudentLoanPayment * 12);

    // Emergency fund target
    const emergencyTarget = totalMonthlyExpenses * 6;
    if (savings > emergencyTarget * 1.2) {
      const excess = savings - emergencyTarget;
      investments += excess * 0.5;
      savings -= excess * 0.5;
    }

    // Stress calculation (0-100)
    const debtToIncomeRatio = (totalMonthlyExpenses / monthlyNet);
    const savingsRatio = savings / (totalMonthlyExpenses * 12);
    stressLevel = Math.max(10, Math.min(95,
      (debtToIncomeRatio * 60) +
      (savingsRatio < 0.5 ? 20 : 0) +
      (monthlyCashFlow < 0 ? 30 : 0) +
      (studentLoan > currentSalary * 0.5 ? 15 : 0) -
      (hasRoommate ? 8 : 0) -
      (investments > currentSalary ? 10 : 0)
    ));

    // Random life events at certain years
    const lifeEvents = [];
    if (year === 3 && Math.random() > 0.5) lifeEvents.push({ type: 'job_change', label: 'Job Switch +15% salary', impact: 0.15 });
    if (year === 5 && Math.random() > 0.6) lifeEvents.push({ type: 'recession', label: 'Market downturn (-15% investments)', impact: -0.15 });
    if (year === 8 && Math.random() > 0.4) lifeEvents.push({ type: 'medical', label: 'Medical expense', impact: -3000 });
    if (year === 10) lifeEvents.push({ type: 'milestone', label: '10-Year Review', impact: 0 });
    if (year === 15 && Math.random() > 0.5) lifeEvents.push({ type: 'family', label: 'Major life change', impact: -5000 });

    results.push({
      year: new Date().getFullYear() + year,
      age: 22 + year, // assumed start age
      salary: Math.round(currentSalary),
      netMonthly: Math.round(monthlyNet),
      expenses: Math.round(totalMonthlyExpenses),
      cashFlow: Math.round(monthlyCashFlow),
      savings: Math.round(Math.max(0, savings)),
      investments: Math.round(Math.max(0, investments)),
      netWorth: Math.round(Math.max(-100000, savings + investments - studentLoan - monthlyDebt * 12 * 5)),
      studentLoan: Math.round(studentLoan),
      stressLevel: Math.round(stressLevel),
      debtToIncome: Math.round(debtToIncomeRatio * 100),
      effectiveTaxRate: Math.round(taxes.effectiveRate * 100),
      breakdown: {
        rent: Math.round(monthlyRent),
        food: Math.round(monthlyGroceries),
        transport: Math.round(monthlyTransport),
        entertainment: Math.round(monthlyEntertainment),
        utilities: Math.round(monthlyUtilities),
        debt: Math.round(monthlyDebtPayment + monthlyStudentLoanPayment),
        healthcare: Math.round(monthlyHealthcare),
        misc: Math.round(monthlyMisc),
      },
      lifeEvents,
    });

    // Update for next year
    currentSalary *= (1 + econ.salaryGrowthRate + (Math.random() * 0.02 - 0.01));
    currentRent *= (1 + city.rentGrowthRate + (Math.random() * city.rentGrowthMargin - city.rentGrowthMargin / 2));
  }

  // Retirement estimate
  const retirementTarget = results[results.length - 1].salary * 25; // 4% rule
  const retirementYear = results.find(r => r.investments >= retirementTarget);

  return {
    projections: results,
    retirementYear: retirementYear ? retirementYear.age : null,
    retirementTarget: Math.round(retirementTarget),
    city,
    econ,
    summary: {
      yearlyGrowthRange: `+${((city.rentGrowthRate - city.rentGrowthMargin) * 100).toFixed(0)}% to +${((city.rentGrowthRate + city.rentGrowthMargin) * 100).toFixed(0)}%`,
      homePriceGrowth: `+${((city.homePriceGrowthRate - city.homePriceGrowthMargin) * 100).toFixed(0)}% to +${((city.homePriceGrowthRate + city.homePriceGrowthMargin) * 100).toFixed(0)}%`,
    },
  };
}

export function analyzeListingCost(listingText, annualIncome, cityKey) {
  const city = CITIES[cityKey] || CITIES["Atlanta, GA"];
  const text = listingText.toLowerCase();

  // Extract rent/price from text
  const rentMatch = text.match(/\$[\d,]+\s*\/?\s*(?:mo|month|per month)/);
  const priceMatch = text.match(/\$[\d,]+(?:k|,000)?(?:\s+(?:home|house|condo|apartment|listing))?/);

  let estimatedRent = 0;
  let estimatedPrice = 0;
  let isForSale = text.includes('for sale') || text.includes('purchase') || text.includes('listing price');

  if (rentMatch) {
    estimatedRent = parseFloat(rentMatch[0].replace(/[\$,\/mo\s]+/g, '').replace('month',''));
  } else if (priceMatch) {
    let val = priceMatch[0].replace(/[\$,\s]/g, '');
    if (val.endsWith('k')) val = parseFloat(val) * 1000;
    else val = parseFloat(val);
    if (val > 10000) { estimatedPrice = val; isForSale = true; }
    else { estimatedRent = val; }
  }

  if (!estimatedRent && !estimatedPrice) {
    estimatedRent = city.medianRent1BR;
  }

  const hiddenCosts = [];
  let totalMonthly = estimatedRent;

  if (isForSale && estimatedPrice > 0) {
    const downPayment = estimatedPrice * 0.2;
    const loanAmount = estimatedPrice * 0.8;
    const monthlyMortgage = (loanAmount * 0.07 / 12) / (1 - Math.pow(1 + 0.07/12, -360));
    const propertyTax = estimatedPrice * 0.012 / 12;
    const insurance = estimatedPrice * 0.005 / 12;
    const maintenance = estimatedPrice * 0.01 / 12;
    const hoa = text.includes('hoa') ? 250 : 0;

    totalMonthly = monthlyMortgage + propertyTax + insurance + maintenance + hoa;

    hiddenCosts.push({ label: 'Mortgage (7% rate, 30yr)', monthly: Math.round(monthlyMortgage), risk: 'medium' });
    hiddenCosts.push({ label: 'Property Tax', monthly: Math.round(propertyTax), risk: 'low' });
    hiddenCosts.push({ label: 'Homeowner Insurance', monthly: Math.round(insurance), risk: 'low' });
    hiddenCosts.push({ label: 'Maintenance & Repairs (1%/yr)', monthly: Math.round(maintenance), risk: 'high' });
    if (hoa > 0) hiddenCosts.push({ label: 'HOA Fees', monthly: hoa, risk: 'medium' });
    hiddenCosts.push({ label: 'Down Payment Needed', monthly: 0, oneTime: Math.round(downPayment), risk: 'high' });
  } else {
    // Apartment/rental
    const utils = text.includes('utilities included') ? 0 : 180;
    const parking = text.includes('parking') ? 100 : 0;
    const petFee = text.includes('pet') ? 50 : 0;
    const renterInsurance = 20;
    const laundry = text.includes('laundry') ? 0 : 40;
    const moversDeposit = estimatedRent * 2; // first + security

    if (utils > 0) hiddenCosts.push({ label: 'Utilities (not included)', monthly: utils, risk: 'medium' });
    if (parking > 0) hiddenCosts.push({ label: 'Parking', monthly: parking, risk: 'low' });
    if (petFee > 0) hiddenCosts.push({ label: 'Pet Fee', monthly: petFee, risk: 'low' });
    hiddenCosts.push({ label: "Renter's Insurance", monthly: renterInsurance, risk: 'low' });
    if (laundry > 0) hiddenCosts.push({ label: 'Laundry (no in-unit)', monthly: laundry, risk: 'low' });
    hiddenCosts.push({ label: 'Move-in costs (est.)', monthly: 0, oneTime: Math.round(moversDeposit), risk: 'medium' });

    totalMonthly += hiddenCosts.reduce((s, c) => s + (c.monthly || 0), 0);
  }

  // Add lifestyle costs
  const lifestyle = [
    { label: 'Groceries & Dining', monthly: Math.round(500 * city.groceriesIndex), risk: 'low' },
    { label: 'Transportation', monthly: Math.round(350 * city.transportIndex), risk: 'low' },
    { label: 'Healthcare', monthly: 250, risk: 'medium' },
    { label: 'Entertainment & Social', monthly: 300, risk: 'low' },
    { label: 'Subscriptions & Phone', monthly: 120, risk: 'low' },
  ];
  const lifestyleTotal = lifestyle.reduce((s, c) => s + c.monthly, 0);
  totalMonthly += lifestyleTotal;

  const taxMultiplier = 1 / (1 - (0.24 + city.stateTax + FICA_RATE));
  const requiredGrossIncome = totalMonthly * 12 * taxMultiplier;
  const currentAffordability = annualIncome > 0 ? ((annualIncome / requiredGrossIncome) * 100).toFixed(0) : 0;

  // Future cost projection
  const projectedRentIn5yr = estimatedRent > 0
    ? estimatedRent * Math.pow(1 + city.rentGrowthRate, 5)
    : 0;
  const projectedPriceIn5yr = estimatedPrice > 0
    ? estimatedPrice * Math.pow(1 + city.homePriceGrowthRate, 5)
    : 0;

  return {
    isForSale,
    estimatedRent,
    estimatedPrice,
    hiddenCosts,
    lifestyle,
    totalMonthly: Math.round(totalMonthly),
    requiredGrossIncome: Math.round(requiredGrossIncome),
    currentAffordability: parseInt(currentAffordability),
    projectedRentIn5yr: Math.round(projectedRentIn5yr),
    projectedPriceIn5yr: Math.round(projectedPriceIn5yr),
    marketGrowthLabel: isForSale
      ? `+${((city.homePriceGrowthRate - city.homePriceGrowthMargin) * 100).toFixed(0)}% to +${((city.homePriceGrowthRate + city.homePriceGrowthMargin) * 100).toFixed(0)}% annually`
      : `+${((city.rentGrowthRate - city.rentGrowthMargin) * 100).toFixed(0)}% to +${((city.rentGrowthRate + city.rentGrowthMargin) * 100).toFixed(0)}% annually`,
    city,
  };
}

export function compareDecisions(optionA, optionB, cityKey, currentAge = 22) {
  const city = CITIES[cityKey] || CITIES["Atlanta, GA"];

  function project(opt, years = 20) {
    let salary = opt.salary || 50000;
    let savings = opt.upfrontCost ? -opt.upfrontCost : 0;
    let investments = 0;
    let debt = opt.debt || 0;
    let happiness = opt.happiness || 50;
    const results = [];

    for (let y = 0; y <= years; y++) {
      const taxes = calculateTotalTax(salary, city.stateTax);
      const monthlyNet = taxes.netIncome / 12;
      const monthlyExpenses = (opt.monthlyExpenses || 2500) * (y > 0 ? Math.pow(1.03, y) : 1);
      const cashFlow = monthlyNet - monthlyExpenses;
      const monthlyInvest = Math.max(0, cashFlow * 0.3);

      savings += Math.max(0, cashFlow * 0.5) * 12;
      investments = investments * 1.09 + monthlyInvest * 12;
      debt = Math.max(0, debt - (opt.debtPayoff || 0) * 12);

      results.push({
        year: currentAge + y,
        salary: Math.round(salary),
        netWorth: Math.round(savings + investments - debt),
        savings: Math.round(Math.max(0, savings)),
        investments: Math.round(Math.max(0, investments)),
        cashFlow: Math.round(cashFlow),
        happiness: Math.min(95, Math.max(10, happiness + (cashFlow > 500 ? 2 : -1) * (y > 0 ? 0.5 : 0))),
        stressLevel: Math.max(10, Math.min(90, 60 - cashFlow / 100)),
      });

      salary *= (1 + (opt.salaryGrowthRate || ECONOMIC_SCENARIOS.baseline.salaryGrowthRate));
    }
    return results;
  }

  const projA = project(optionA);
  const projB = project(optionB);

  // Market-adjusted factors
  const marketFactors = [];
  if (cityKey === "San Francisco, CA" || cityKey === "New York, NY") {
    marketFactors.push({ label: 'High COL city premium', impact: 'negative', note: 'Living costs could erode salary advantage' });
  }
  if (city.jobGrowthRate > 0.04) {
    marketFactors.push({ label: 'Strong local job market', impact: 'positive', note: `${(city.jobGrowthRate * 100).toFixed(1)}% annual job growth` });
  }
  if (city.homePriceGrowthRate > 0.07) {
    marketFactors.push({ label: 'Rapid housing inflation', impact: 'negative', note: `Home prices rising ${((city.homePriceGrowthRate) * 100).toFixed(0)}% ±${(city.homePriceGrowthMargin * 100).toFixed(0)}%/yr` });
  }

  return {
    optionA: { ...optionA, projections: projA },
    optionB: { ...optionB, projections: projB },
    crossoverYear: projA.findIndex((a, i) => projB[i] && a.netWorth > projB[i].netWorth),
    marketFactors,
    city,
    winner5yr: projA[5]?.netWorth > projB[5]?.netWorth ? 'A' : 'B',
    winner20yr: projA[20]?.netWorth > projB[20]?.netWorth ? 'A' : 'B',
  };
}

export function formatCurrency(n) {
  if (!n && n !== 0) return '$—';
  if (Math.abs(n) >= 1000000) return `$${(n/1000000).toFixed(1)}M`;
  if (Math.abs(n) >= 1000) return `$${(n/1000).toFixed(0)}k`;
  return `$${Math.round(n).toLocaleString()}`;
}

export function getStressLabel(level) {
  if (level < 25) return { label: 'Low Stress', color: '#00f578' };
  if (level < 50) return { label: 'Manageable', color: '#ffd60a' };
  if (level < 70) return { label: 'High Stress', color: '#ff6b35' };
  return { label: 'Critical', color: '#ff2d78' };
}

export function getHealthLabel(score) {
  if (score >= 80) return { label: 'Excellent', color: '#00f578' };
  if (score >= 60) return { label: 'Good', color: '#00f5d4' };
  if (score >= 40) return { label: 'Fair', color: '#ffd60a' };
  return { label: 'Poor', color: '#ff2d78' };
}
