import validator from 'validator';

/**
 * Normalizes a string by trimming whitespace and collapsing multiple spaces
 * 
 * @param text - The input string to normalize
 * @returns Normalized string with trimmed whitespace and collapsed spaces
 */
export const normalizeText = (text: string): string => {
  return validator.trim(validator.whitelist(text.replace(/\s+/g, ' '), 
    'a-zA-Z0-9\\s\\-_.,!?@#$%^&*()+={}[]|:;"\'<>/\\'));
};

/**
 * Normalizes an array of strings by removing duplicates and empty values
 * 
 * @param items - Array of strings to normalize
 * @returns Array with duplicates removed and empty values filtered out
 */
export const normalizeArray = (items: string[]): string[] => {
  return Array.from(new Set(
    items.map(item => validator.trim(item)).filter(item => !validator.isEmpty(item))
  ));
};

/**
 * Normalizes an email address to lowercase and trims whitespace
 * 
 * @param email - The email address to normalize
 * @returns Normalized email in lowercase without whitespace
 */
export const normalizeEmail = (email: string): string => {
  return validator.normalizeEmail(email.trim().toLowerCase()) || email.trim().toLowerCase();
};

/**
 * Normalizes a phone number to a consistent format
 * Handles various input formats and converts to international format
 * 
 * @param phone - The phone number to normalize
 * @returns Normalized phone number in format +63XXXXXXXXXX or cleaned digits
 */
export const normalizePhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('63') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+63${cleaned.slice(1)}`;
  }
  
  return cleaned;
};

/**
 * Normalizes a numeric string by removing non-numeric characters
 * Preserves decimal point for float values
 * 
 * @param value - The numeric string to normalize
 * @returns Cleaned numeric string with only digits and one decimal point
 */
export const normalizeNumber = (value: string): string => {
  const cleaned = value.replace(/[^\d.]/g, '');
  
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('')}`;
  }
  
  return cleaned;
};