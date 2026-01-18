export interface CurrencyFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
  showSpace?: boolean;
}

/**
 * Formats a number as Philippine Peso currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "₱1,234.56")
 */
export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    locale = 'en-PH',
    showSpace = false,
  } = options;

  const formatted = amount.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return showSpace ? `₱ ${formatted}` : `₱${formatted}`;
}

/**
 * Calculates the amount per scholar based on total amount and slots
 * @param totalAmount - Total scholarship amount
 * @param totalSlot - Total number of slots
 * @returns Amount per scholar, or null if calculation is not possible
 */
export function calculateAmountPerScholar(
  totalAmount: number | null | undefined,
  totalSlot: number | null | undefined
): number | null {
  if (!totalAmount || !totalSlot || totalSlot <= 0) return null;
  return totalAmount / totalSlot;
}

/**
 * Formats a date string to a long date format
 * @param dateString - Date string or Date object
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'No date';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date string to include both date and time
 * @param dateString - Date string or Date object
 * @returns Formatted date and time string (e.g., "Jan 15, 2024, 2:30 PM")
 */
export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'No date';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a date string to show only the time
 * @param dateString - Date string or Date object
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'No time';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return 'Invalid time';
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a date string for application deadline display
 * @param dateString - Date string or Date object
 * @returns Formatted date string for deadline display
 */
export function formatDeadline(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'Application deadline';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) return 'Application deadline';
  
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats currency amount per scholar with fallback
 * @param totalAmount - Total scholarship amount
 * @param totalSlot - Total number of slots
 * @param options - Currency formatting options
 * @returns Formatted currency string or default value
 */
export function formatAmountPerScholar(
  totalAmount: number | null | undefined,
  totalSlot: number | null | undefined,
  options: CurrencyFormatOptions = {}
): string {
  const amountPerScholar = calculateAmountPerScholar(totalAmount, totalSlot);
  
  if (amountPerScholar === null) {
    return options.showSpace ? '₱ 0.00' : '₱0.00';
  }
  
  return formatCurrency(amountPerScholar, options);
}

/**
 * Formats a credential issued date to display month and year
 * @param issuedDate - Date string in format like 'YYYY-MM-DD' or similar
 * @returns Formatted date string (e.g., "January 2024") or original input if invalid
 */
export function formatCredentialDate(issuedDate: string): string {
  try {
    if (issuedDate.match(/^\d{4}-\d{2}/)) {
      const date = new Date(issuedDate);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        });
      }
    }
    return issuedDate;
  } catch {
    return issuedDate;
  }
}

