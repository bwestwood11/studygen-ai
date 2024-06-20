import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Message } from "./types/messages"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function currencyFormatter(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function numberFormatter(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount)
}

export function HistoryParser(history:Message[]) {
  return history.map((h) => ({
    role:h.by,
    parts:[{text:h.message}]
  }))
}