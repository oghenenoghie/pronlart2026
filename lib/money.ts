const CURRENCY_EXPONENT: Record<string, number> = {
  NGN: 2,
  USD: 2,
  EUR: 2,
  GBP: 2,
  KWD: 3,
  BHD: 3,
  JPY: 0,
};

function exponentFor(currency: string): number {
  return CURRENCY_EXPONENT[currency] ?? 2;
}

/** Format integer minor units as a currency string, or "Price on request" when null. */
export function formatPrice(minorUnits: number | null, currency: string): string {
  if (minorUnits === null) return "Price on request";
  const exponent = exponentFor(currency);
  const major = minorUnits / 10 ** exponent;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: exponent,
    maximumFractionDigits: exponent,
  }).format(major);
}

/** Parse a major-unit decimal string (e.g. "850000.00") into integer minor units. */
export function parseToMinorUnits(major: string, currency: string): number {
  const exponent = exponentFor(currency);
  return Math.round(parseFloat(major) * 10 ** exponent);
}

/** Inverse of parseToMinorUnits — for pre-filling an editable price input. */
export function toMajorUnitsString(minorUnits: number, currency: string): string {
  const exponent = exponentFor(currency);
  return (minorUnits / 10 ** exponent).toFixed(exponent);
}

export function addMinorUnits(a: number, b: number): number {
  return a + b;
}
