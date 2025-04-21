import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private renderer: Renderer2;
  private readonly STORAGE_KEY = 'accessibility_preferences';
  private readonly HIGH_CONTRAST_CLASS = 'high-contrast-mode';
  private readonly LARGE_TEXT_CLASS = 'large-text-mode';
  private readonly REDUCED_MOTION_CLASS = 'reduced-motion-mode';
  private readonly SCREEN_READER_CLASS = 'screen-reader-optimized';
  
  private preferencesSubject: BehaviorSubject<AccessibilityPreferences>;
  
  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    
    // Initialize with stored preferences or defaults
    const storedPrefs = this.loadPreferences();
    this.preferencesSubject = new BehaviorSubject<AccessibilityPreferences>(storedPrefs);
    
    // Apply initial preferences
    this.applyPreferences(storedPrefs);
    
    // Check for prefers-reduced-motion media query
    this.checkSystemPreferences();
  }
  
  /**
   * Get current accessibility preferences as an Observable
   */
  getPreferences(): Observable<AccessibilityPreferences> {
    return this.preferencesSubject.asObservable();
  }
  
  /**
   * Toggle high contrast mode
   */
  toggleHighContrast(): void {
    const prefs = this.preferencesSubject.value;
    prefs.highContrast = !prefs.highContrast;
    this.updatePreferences(prefs);
  }
  
  /**
   * Toggle large text mode
   */
  toggleLargeText(): void {
    const prefs = this.preferencesSubject.value;
    prefs.largeText = !prefs.largeText;
    this.updatePreferences(prefs);
  }
  
  /**
   * Toggle reduced motion mode
   */
  toggleReducedMotion(): void {
    const prefs = this.preferencesSubject.value;
    prefs.reducedMotion = !prefs.reducedMotion;
    this.updatePreferences(prefs);
  }
  
  /**
   * Toggle screen reader optimized mode
   */
  toggleScreenReaderOptimized(): void {
    const prefs = this.preferencesSubject.value;
    prefs.screenReaderOptimized = !prefs.screenReaderOptimized;
    this.updatePreferences(prefs);
  }
  
  /**
   * Reset all preferences to default values
   */
  resetPreferences(): void {
    const defaultPrefs: AccessibilityPreferences = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReaderOptimized: false
    };
    
    this.updatePreferences(defaultPrefs);
  }
  
  /**
   * Update preferences and apply them
   */
  private updatePreferences(prefs: AccessibilityPreferences): void {
    this.preferencesSubject.next(prefs);
    this.savePreferences(prefs);
    this.applyPreferences(prefs);
  }
  
  /**
   * Apply preferences to the DOM
   */
  private applyPreferences(prefs: AccessibilityPreferences): void {
    const bodyElement = this.document.body;
    
    // High contrast
    if (prefs.highContrast) {
      this.renderer.addClass(bodyElement, this.HIGH_CONTRAST_CLASS);
    } else {
      this.renderer.removeClass(bodyElement, this.HIGH_CONTRAST_CLASS);
    }
    
    // Large text
    if (prefs.largeText) {
      this.renderer.addClass(bodyElement, this.LARGE_TEXT_CLASS);
    } else {
      this.renderer.removeClass(bodyElement, this.LARGE_TEXT_CLASS);
    }
    
    // Reduced motion
    if (prefs.reducedMotion) {
      this.renderer.addClass(bodyElement, this.REDUCED_MOTION_CLASS);
    } else {
      this.renderer.removeClass(bodyElement, this.REDUCED_MOTION_CLASS);
    }
    
    // Screen reader optimized
    if (prefs.screenReaderOptimized) {
      this.renderer.addClass(bodyElement, this.SCREEN_READER_CLASS);
    } else {
      this.renderer.removeClass(bodyElement, this.SCREEN_READER_CLASS);
    }
  }
  
  /**
   * Save preferences to localStorage
   */
  private savePreferences(prefs: AccessibilityPreferences): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prefs));
  }
  
  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): AccessibilityPreferences {
    const defaultPrefs: AccessibilityPreferences = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReaderOptimized: false
    };
    
    try {
      const storedPrefs = localStorage.getItem(this.STORAGE_KEY);
      return storedPrefs ? JSON.parse(storedPrefs) : defaultPrefs;
    } catch (error) {
      console.error('Error loading accessibility preferences:', error);
      return defaultPrefs;
    }
  }
  
  /**
   * Check system preferences for accessibility settings
   */
  private checkSystemPreferences(): void {
    // Check for prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      const prefs = this.preferencesSubject.value;
      prefs.reducedMotion = true;
      this.updatePreferences(prefs);
    }
    
    // Listen for changes to prefers-reduced-motion
    reducedMotionQuery.addEventListener('change', (event) => {
      const prefs = this.preferencesSubject.value;
      prefs.reducedMotion = event.matches;
      this.updatePreferences(prefs);
    });
  }
}