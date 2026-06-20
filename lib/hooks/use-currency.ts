"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice, formatPriceCompact, type CurrencyLike } from "@/lib/format-currency";

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

const LS_KEY = "deni_currency";

export function useCurrency() {
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
          const preferred = match || data[0] || null;
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

  return { currencies, selected, select, loading, format, formatCompact };
}
