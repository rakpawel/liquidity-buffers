import { formatUnits } from "viem";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatValue = (value: bigint, decimals: number) => {
  const parsed = Number(formatUnits(value, decimals));
  if (parsed >= 1000000) {
    return `${(parsed / 1000000).toFixed(2)}M`;
  } else if (parsed >= 1000) {
    return `${(parsed / 1000).toFixed(2)}K`;
  }
  return parsed.toFixed(2);
};

export const calculateRatios = (
  underlying: bigint,
  wrapped: bigint,
  decimals: number
) => {
  const underlyingValue = Number(formatUnits(underlying, decimals));
  const wrappedValue = Number(formatUnits(wrapped, decimals));
  const total = underlyingValue + wrappedValue;

  if (total === 0) return { underlying: "0.0", wrapped: "0.0" };

  const underlyingPercent = ((underlyingValue / total) * 100).toFixed(1);
  const wrappedPercent = ((wrappedValue / total) * 100).toFixed(1);

  return { underlying: underlyingPercent, wrapped: wrappedPercent };
};

export const shortCurrencyFormat = (num: number, fraction = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "long",
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(num);
