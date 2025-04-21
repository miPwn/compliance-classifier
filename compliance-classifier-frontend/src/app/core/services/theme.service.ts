import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentThemeSubject = new BehaviorSubject<Theme>('light');
  private readonly THEME_KEY = 'compliance-classifier-theme';

  constructor(
    rendererFactory: RendererFactory2,
    private messageService: MessageService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  /**
   * Initialize theme from local storage or system preference
   */
  private initTheme(): void {
    console.log('ThemeService: Initializing theme');
    
    try {
      // Try to get theme from localStorage
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
      console.log('ThemeService: Saved theme from localStorage:', savedTheme);
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        console.log('ThemeService: Using saved theme from localStorage:', savedTheme);
        this.setTheme(savedTheme);
      } else {
        // Check if user prefers dark mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('ThemeService: User prefers dark mode:', prefersDark);
        this.setTheme(prefersDark ? 'dark' : 'light');
      }
      
      // Force apply theme to ensure it's set correctly
      const currentTheme = this.getCurrentTheme();
      console.log('ThemeService: Forcing theme application:', currentTheme);
      
      if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      
      console.log('ThemeService: Body classes after init:', document.body.className);
    } catch (error) {
      console.error('ThemeService: Error initializing theme:', error);
      // Fallback to light theme
      this.setTheme('light');
    }
  }

  /**
   * Get the current theme
   */
  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  /**
   * Get an observable of the current theme
   */
  getTheme(): Observable<Theme> {
    return this.currentThemeSubject.asObservable();
  }

  /**
   * Set the theme
   * @param theme The theme to set
   */
  setTheme(theme: Theme): void {
    console.log('ThemeService: Setting theme to', theme);
    
    try {
      // Ensure theme is a valid value
      if (theme !== 'light' && theme !== 'dark') {
        console.error('ThemeService: Invalid theme value:', theme);
        theme = 'light'; // Default to light theme if invalid
      }
      
      // Apply theme using both renderer and direct DOM manipulation for redundancy
      if (theme === 'dark') {
        console.log('ThemeService: Adding dark-theme class to body');
        this.renderer.addClass(document.body, 'dark-theme');
        document.body.classList.add('dark-theme');
        
        // Force update CSS variables directly
        document.documentElement.style.setProperty('--primary-color', 'var(--dark-primary-color)');
        document.documentElement.style.setProperty('--text-color', 'var(--dark-text-color)');
        document.documentElement.style.setProperty('--surface-ground', 'var(--dark-surface-ground)');
      } else {
        console.log('ThemeService: Removing dark-theme class from body');
        this.renderer.removeClass(document.body, 'dark-theme');
        document.body.classList.remove('dark-theme');
        
        // Reset CSS variables to light theme
        document.documentElement.style.setProperty('--primary-color', 'var(--light-primary-color)');
        document.documentElement.style.setProperty('--text-color', 'var(--light-text-color)');
        document.documentElement.style.setProperty('--surface-ground', 'var(--light-surface-ground)');
      }

      // Save to localStorage
      localStorage.setItem(this.THEME_KEY, theme);
      this.currentThemeSubject.next(theme);
      
      // Show notification
      this.showThemeChangeNotification(theme);
      
      console.log('ThemeService: Theme set to', theme, 'Body classes:', document.body.className);
      
      // Dispatch a custom event for any components that might need to react to theme changes
      const themeChangeEvent = new CustomEvent('themeChanged', { detail: { theme } });
      window.dispatchEvent(themeChangeEvent);
    } catch (error) {
      console.error('ThemeService: Error setting theme:', error);
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    console.log('ThemeService: Toggling theme');
    const currentTheme = this.getCurrentTheme();
    console.log('ThemeService: Current theme is', currentTheme);
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    console.log('ThemeService: New theme will be', newTheme);
    
    // Direct DOM manipulation in addition to using the renderer
    if (newTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    this.setTheme(newTheme);
    
    // Force a redraw by toggling a class
    document.body.classList.add('theme-changing');
    setTimeout(() => {
      document.body.classList.remove('theme-changing');
    }, 50);
    
    console.log('ThemeService: After toggle, body classes:', document.body.className);
  }
  
  /**
   * Show a notification when the theme is changed
   * @param theme The new theme
   */
  private showThemeChangeNotification(theme: Theme): void {
    const isDark = theme === 'dark';
    
    this.messageService.add({
      severity: 'info',
      summary: 'Theme Changed',
      detail: `Switched to ${isDark ? 'Dark' : 'Light'} Mode`,
      icon: isDark ? 'pi pi-moon' : 'pi pi-sun',
      life: 3000,
      styleClass: isDark ? 'dark-toast' : 'light-toast'
    });
  }
}