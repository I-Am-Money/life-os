const USERS_KEY   = 'lifeos_users'
const SESSION_KEY = 'lifeos_session'

function getUsers() {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
}
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)) }
function getSession() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}
function saveSession(u) { localStorage.setItem(SESSION_KEY, JSON.stringify(u)) }
function clearSession()  { localStorage.removeItem(SESSION_KEY) }

function buildTransactions(profile) {
  const cats = [
    { name: 'Rent',          amount: profile.monthlyRent    || 1500 },
    { name: 'Groceries',     amount: profile.groceries      || 400  },
    { name: 'Transport',     amount: profile.transport      || 200  },
    { name: 'Dining Out',    amount: profile.diningOut      || 250  },
    { name: 'Entertainment', amount: profile.entertainment  || 120  },
    { name: 'Utilities',     amount: profile.utilities      || 130  },
    { name: 'Health',        amount: profile.health         || 80   },
    { name: 'Shopping',      amount: profile.shopping       || 180  },
    { name: 'Subscriptions', amount: profile.subscriptions  || 60   },
  ]
  const txns = []
  const now  = Date.now()
  for (let mo = 5; mo >= 0; mo--) {
    const ts = now - mo * 30 * 24 * 60 * 60 * 1000
    cats.forEach(cat => {
      const variance = cat.name === 'Rent' ? 1 : 0.8 + Math.random() * 0.4
      txns.push({ id: `${ts}_${cat.name}`, category: cat.name, amount: Math.round(cat.amount * variance), date: ts, monthsAgo: mo })
    })
  }
  return txns
}

export function signup(email, password, name) {
  const users = getUsers()
  const key   = email.toLowerCase().trim()
  if (users[key])          return { error: 'An account with this email already exists.' }
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' }
  if (!name.trim())        return { error: 'Please enter your name.' }

  const user = {
    id:        `user_${Date.now()}`,
    email:     key,
    name:      name.trim(),
    createdAt: Date.now(),
    profile:   { salary: 0, city: 'Atlanta, GA', monthlyExpenses: 0, savings: 0, debt: 0, investmentRate: 0.2 },
    transactions: [],
  }
  users[key] = { ...user, password }
  saveUsers(users)
  const { password: _, ...safe } = users[key]
  saveSession(safe)
  return { user: safe }
}

export function login(email, password) {
  const users = getUsers()
  const key   = email.toLowerCase().trim()
  const user  = users[key]
  if (!user)                  return { error: 'No account found with this email.' }
  if (user.password !== password) return { error: 'Incorrect password.' }
  const { password: _, ...safe } = user
  saveSession(safe)
  return { user: safe }
}

export function logout() { clearSession() }

export function getCurrentUser() { return getSession() }

export function updateProfile(updates) {
  const session = getSession()
  if (!session) return null
  const users = getUsers()
  const key   = session.email
  if (!users[key]) return null

  const merged = {
    ...users[key],
    ...updates,
    profile: { ...users[key].profile, ...updates.profile },
  }

  // Rebuild transactions from actual profile spending data
  merged.transactions = buildTransactions(merged.profile)

  // Compute derived monthlyExpenses
  const p = merged.profile
  merged.profile.monthlyExpenses = (
    (p.monthlyRent    || 0) + (p.groceries      || 0) + (p.transport   || 0) +
    (p.diningOut      || 0) + (p.entertainment  || 0) + (p.utilities   || 0) +
    (p.health         || 0) + (p.shopping       || 0) + (p.subscriptions || 0)
  )

  users[key] = merged
  saveUsers(users)
  const { password: _, ...safe } = merged
  saveSession(safe)
  return safe
}
