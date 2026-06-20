export interface CurrencyLike {
  code: string;
  symbol: string;
  rate: number;
}

export const DEFAULT_CURRENCY: CurrencyLike = {
  code: "GBP",
  symbol: "£",
  rate: 1,
};

export function formatPrice(amount: number, currency?: CurrencyLike | null): string {
  const c = currency || DEFAULT_CURRENCY;
  const converted = amount / c.rate;
  return `${c.symbol}${converted.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPriceCompact(amount: number, currency?: CurrencyLike | null): string {
  const c = currency || DEFAULT_CURRENCY;
  const converted = amount / c.rate;
  if (converted >= 1_000_000) {
    return `${c.symbol}${(converted / 1_000_000).toFixed(1)}M`;
  }
  if (converted >= 1_000) {
    return `${c.symbol}${(converted / 1_000).toFixed(1)}k`;
  }
  return `${c.symbol}${converted.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
