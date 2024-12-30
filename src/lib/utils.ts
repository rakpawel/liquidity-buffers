import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatValue = (value: string, decimals: number) => {
  const parsed = parseFloat(value) / Math.pow(10, decimals);
  if (parsed >= 1000000) {
    return `${(parsed / 1000000).toFixed(2)}M`;
  } else if (parsed >= 1000) {
    return `${(parsed / 1000).toFixed(2)}K`;
  }
  return parsed.toFixed(2);
};

export const calculateRatios = (
  underlying: string,
  wrapped: string,
  decimals: number
) => {
  const underlyingValue = parseFloat(underlying) / Math.pow(10, decimals);
  const wrappedValue = parseFloat(wrapped) / Math.pow(10, decimals);
  const total = underlyingValue + wrappedValue;

  if (total === 0) return { underlying: "0.0", wrapped: "0.0" };

  const underlyingPercent = ((underlyingValue / total) * 100).toFixed(1);
  const wrappedPercent = ((wrappedValue / total) * 100).toFixed(1);

  return { underlying: underlyingPercent, wrapped: wrappedPercent };
};
