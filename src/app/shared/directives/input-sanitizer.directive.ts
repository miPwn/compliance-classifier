import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgControl } from '@angular/forms';

/**
 * Directive to sanitize input values to prevent XSS attacks
 * Usage: <input appInputSanitizer [sanitizePattern]="regex" [sanitizeReplace]="replacement">
 */
@Directive({
  selector: '[appInputSanitizer]',
  standalone: true
})
export class InputSanitizerDirective implements OnInit {
  @Input() sanitizePattern: RegExp | string = /[<>]/g; // Default pattern removes < and > characters
  @Input() sanitizeReplace: string = ''; // Default replacement is to remove matched characters
  
  private pattern!: RegExp;
  private el: HTMLInputElement;
  
  constructor(
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private control: NgControl
  ) {
    this.el = this.elementRef.nativeElement;
  }
  
  ngOnInit(): void {
    // Convert string pattern to RegExp if needed
    this.pattern = typeof this.sanitizePattern === 'string' 
      ? new RegExp(this.sanitizePattern, 'g') 
      : this.sanitizePattern;
  }
  
  /**
   * Sanitize input on value change
   */
  @HostListener('input', ['$event']) 
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = this.sanitizeValue(input.value);
    
    // Only update if the value has changed
    if (sanitizedValue !== input.value) {
      // Update the input value
      input.value = sanitizedValue;
      
      // Update the form control value
      if (this.control && this.control.control) {
        this.control.control.setValue(sanitizedValue, { 
          emitEvent: false,
          emitModelToViewChange: false
        });
      }
    }
  }
  
  /**
   * Sanitize input on paste
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    // Let the paste happen, then sanitize
    setTimeout(() => {
      const sanitizedValue = this.sanitizeValue(this.el.value);
      
      // Only update if the value has changed
      if (sanitizedValue !== this.el.value) {
        // Update the input value
        this.el.value = sanitizedValue;
        
        // Update the form control value
        if (this.control && this.control.control) {
          this.control.control.setValue(sanitizedValue, { 
            emitEvent: true,
            emitModelToViewChange: false
          });
        }
      }
    });
  }
  
  /**
   * Sanitize the input value
   */
  private sanitizeValue(value: string): string {
    if (!value) return value;
    
    // Replace potentially dangerous characters
    return value.replace(this.pattern, this.sanitizeReplace);
  }
}