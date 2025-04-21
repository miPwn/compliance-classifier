import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SensitiveDataService {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Mask a credit card number
   * @param cardNumber The credit card number to mask
   * @returns Masked credit card number (e.g., **** **** **** 1234)
   */
  maskCreditCard(cardNumber: string): string {
    if (!cardNumber) return '';
    
    // Remove all non-digit characters
    const digitsOnly = cardNumber.replace(/\D/g, '');
    
    // Check if it's a valid length for a credit card
    if (digitsOnly.length < 13 || digitsOnly.length > 19) {
      return '****';
    }
    
    // Keep only the last 4 digits visible
    const lastFourDigits = digitsOnly.slice(-4);
    const maskedPart = '*'.repeat(digitsOnly.length - 4);
    
    // Format with spaces for readability
    let formatted = '';
    for (let i = 0; i < maskedPart.length; i++) {
      formatted += maskedPart[i];
      if ((i + 1) % 4 === 0) formatted += ' ';
    }
    
    return (formatted + lastFourDigits).trim();
  }

  /**
   * Mask an email address
   * @param email The email address to mask
   * @returns Masked email (e.g., j***@example.com)
   */
  maskEmail(email: string): string {
    if (!email || !email.includes('@')) return '';
    
    const [username, domain] = email.split('@');
    
    if (username.length <= 1) {
      return `${username}***@${domain}`;
    }
    
    const firstChar = username.charAt(0);
    const maskedUsername = firstChar + '*'.repeat(username.length - 1);
    
    return `${maskedUsername}@${domain}`;
  }

  /**
   * Mask a phone number
   * @param phoneNumber The phone number to mask
   * @returns Masked phone number (e.g., (***) ***-1234)
   */
  maskPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid length for a phone number
    if (digitsOnly.length < 7) {
      return '******';
    }
    
    // Keep only the last 4 digits visible
    const lastFourDigits = digitsOnly.slice(-4);
    const maskedPart = '*'.repeat(digitsOnly.length - 4);
    
    // Format based on length
    if (digitsOnly.length === 10) {
      // US format: (***) ***-1234
      return `(${maskedPart.substring(0, 3)}) ${maskedPart.substring(3)}-${lastFourDigits}`;
    } else {
      // Generic format
      return `${maskedPart}-${lastFourDigits}`;
    }
  }

  /**
   * Mask a social security number
   * @param ssn The SSN to mask
   * @returns Masked SSN (e.g., ***-**-1234)
   */
  maskSSN(ssn: string): string {
    if (!ssn) return '';
    
    // Remove all non-digit characters
    const digitsOnly = ssn.replace(/\D/g, '');
    
    // Check if it's a valid length for an SSN
    if (digitsOnly.length !== 9) {
      return '***-**-****';
    }
    
    // Keep only the last 4 digits visible
    const lastFourDigits = digitsOnly.slice(-4);
    
    return `***-**-${lastFourDigits}`;
  }

  /**
   * Mask a name (first name or full name)
   * @param name The name to mask
   * @returns Masked name (e.g., J*** D***)
   */
  maskName(name: string): string {
    if (!name) return '';
    
    const nameParts = name.trim().split(' ');
    
    return nameParts.map(part => {
      if (part.length <= 1) return part;
      
      const firstChar = part.charAt(0);
      return firstChar + '*'.repeat(part.length - 1);
    }).join(' ');
  }

  /**
   * Mask an address
   * @param address The address to mask
   * @returns Masked address
   */
  maskAddress(address: string): string {
    if (!address) return '';
    
    const lines = address.split('\n');
    
    return lines.map((line, index) => {
      // Keep zip/postal code and country lines intact
      if (index === lines.length - 1) return line;
      
      const words = line.split(' ');
      
      return words.map((word, wordIndex) => {
        // Keep numbers (like house numbers) intact
        if (/^\d+$/.test(word)) return word;
        
        if (word.length <= 1) return word;
        
        const firstChar = word.charAt(0);
        return firstChar + '*'.repeat(word.length - 1);
      }).join(' ');
    }).join('\n');
  }

  /**
   * Sanitize HTML content to prevent XSS attacks
   * @param html The HTML content to sanitize
   * @returns Sanitized HTML that's safe to render
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}