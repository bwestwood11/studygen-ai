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

export function sanitizeFileName(fileName:string) {
  return encodeURIComponent(fileName.toLowerCase().trim().replace(/\s+/g, ' '));
}

function sanitize(filename:string) {
  // Replace unsafe characters with a hyphen
  const sanitized = filename.replace(/[/\\?%*:|"<>]/g, '-');
  
  // Remove leading and trailing spaces and dots
  const trimmed = sanitized.trim().replace(/^\.+|\.+$/g, '');

  // Replace spaces with a single hyphen
  const normalized = trimmed.replace(/\s+/g, '-');

  // Ensure filename is not empty after sanitization
  if (normalized.length === 0) {
    throw new Error('Filename results in an empty string');
  }

  return normalized.toLowerCase();
}

export function generateUniqueFilename(userId:string, originalFilename:string) {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const sanitizedFilename = sanitize(originalFilename).toLowerCase().replace(/\s+/g, '_');
  const extension = originalFilename.split('.').pop();
  const uniqueFilename = `${userId}__${sanitizedFilename}__${timestamp}.${extension}`;
  return uniqueFilename;
}


