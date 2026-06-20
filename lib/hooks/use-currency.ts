"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { formatPrice, formatPriceCompact, type CurrencyLike } from "@/lib/format-currency";

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

const LS_KEY = "deni_currency";

interface CurrencyContextValue {
  currencies: CurrencyOption[];
  selected: CurrencyOption | null;
  select: (code: string) => void;
  loading: boolean;
  format: (amount: number) => string;
  formatCompact: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currencies: [],
  selected: null,
  select: () => {},
  loading: true,
  format: (amount: number) => String(amount),
  formatCompact: (amount: number) => String(amount),
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [selected, setSelected] = useState<CurrencyOption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch("/api/currencies");
        if (res.ok) {
          const data: CurrencyOption[] = await res.json();
          setCurrencies(data);
          const saved = localStorage.getItem(LS_KEY);
          const match = saved ? data.find((c) => c.code === saved) : null;
          const preferred = match
            || data.find((c) => c.code === "GBP")
            || data[0]
            || null;
          setSelected(preferred);
          if (!saved && preferred) {
            localStorage.setItem(LS_KEY, preferred.code);
          }
        }
      } catch {
        // fallback — no currencies configured yet
      } finally {
        setLoading(false);
      }
    }
    fetchCurrencies();
  }, []);

  const select = useCallback((code: string) => {
    const match = currencies.find((c) => c.code === code);
    if (match) {
      setSelected(match);
      localStorage.setItem(LS_KEY, code);
    }
  }, [currencies]);

  const format = useCallback(
    (amount: number) => formatPrice(amount, selected as CurrencyLike | null),
    [selected],
  );

  const formatCompact = useCallback(
    (amount: number) => formatPriceCompact(amount, selected as CurrencyLike | null),
    [selected],
  );

  return (
    <CurrencyContext.Provider value={{ currencies, selected, select, loading, format, formatCompact }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
