const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 0.5, '¼': 0.25, '¾': 0.75,
  '⅓': 1/3, '⅔': 2/3,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
}

const FRACTION_TO_UNICODE: [number, string][] = [
  [0.125, '⅛'], [0.25, '¼'], [0.333, '⅓'], [0.375, '⅜'],
  [0.5, '½'], [0.625, '⅝'], [0.667, '⅔'], [0.75, '¾'],
  [0.875, '⅞'],
]

function toNiceNumber(n: number): string {
  if (Math.abs(n - Math.round(n)) < 0.05) return String(Math.round(n))

  const whole = Math.floor(n)
  const frac = n - whole

  for (const [val, sym] of FRACTION_TO_UNICODE) {
    if (Math.abs(frac - val) < 0.04) {
      return whole > 0 ? `${whole}${sym}` : sym
    }
  }

  return n % 1 === 0 ? String(n) : n.toFixed(1)
}

export function scaleIngredient(text: string, multiplier: number): string {
  if (multiplier === 1) return text

  // Replace unicode fractions with decimal first
  let processed = text
  for (const [sym, val] of Object.entries(UNICODE_FRACTIONS)) {
    // Handle "1½" style (digit + fraction)
    processed = processed.replace(new RegExp(`(\\d+)${sym}`, 'g'), (_, d) => String(Number(d) + val))
    processed = processed.replace(new RegExp(sym, 'g'), String(val))
  }

  // Scale numbers, skip oven temps (300-500 range)
  processed = processed.replace(/\b(\d+(?:\.\d+)?)\b/g, (match, num) => {
    const n = parseFloat(num)
    if (n >= 300 && n <= 500) return match // oven temp
    if (n > 100 && !text.includes('g') && !text.includes('ml')) return match // probably not a quantity
    return toNiceNumber(n * multiplier)
  })

  return processed
}
