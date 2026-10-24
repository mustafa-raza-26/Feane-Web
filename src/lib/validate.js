export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim())

// digits, spaces, dashes, brackets, optional leading +, 7–15 digits in total
export function isPhone(v) {
  const s = String(v).trim()
  if (!/^\+?[\d\s\-()]+$/.test(s)) return false
  const digits = s.replace(/\D/g, '').length
  return digits >= 7 && digits <= 15
}

export const todayISO = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD, local time
