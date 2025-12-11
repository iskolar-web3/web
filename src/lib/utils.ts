import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts
 * 
 * @param inputs - Class values to merge (strings, objects, arrays, etc.)
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
