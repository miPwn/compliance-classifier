import { TestBed } from '@angular/core/testing';
import { RendererFactory2 } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let rendererFactoryMock: jasmine.SpyObj<RendererFactory2>;
  let rendererMock: any;
  let localStorageSpy: jasmine.Spy;
  let documentBodyClassListSpy: jasmine.SpyObj<DOMTokenList>;

  beforeEach(() => {
    // Create spies
    rendererMock = {
      addClass: jasmine.createSpy('addClass'),
      removeClass: jasmine.createSpy('removeClass')
    };
    
    rendererFactoryMock = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
    rendererFactoryMock.createRenderer.and.returnValue(rendererMock);
    
    localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    
    documentBodyClassListSpy = jasmine.createSpyObj('DOMTokenList', ['add', 'remove', 'contains']);
    
    // Mock window.matchMedia
    spyOn(window, 'matchMedia').and.returnValue({
      matches: false
    } as MediaQueryList);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: RendererFactory2, useValue: rendererFactoryMock }
      ]
    });
    
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    // Start with light theme
    expect(service.getCurrentTheme()).toBe('light');
    
    // Toggle to dark
    service.toggleTheme();
    
    expect(service.getCurrentTheme()).toBe('dark');
    expect(rendererMock.addClass).toHaveBeenCalledWith(document.body, 'dark-theme');
    expect(localStorage.setItem).toHaveBeenCalledWith('compliance-classifier-theme', 'dark');
  });

  it('should toggle theme from dark to light', () => {
    // Set initial theme to dark
    service.setTheme('dark');
    
    // Clear mocks
    rendererMock.addClass.calls.reset();
    rendererMock.removeClass.calls.reset();
    
    // Toggle to light
    service.toggleTheme();
    
    expect(service.getCurrentTheme()).toBe('light');
    expect(rendererMock.removeClass).toHaveBeenCalledWith(document.body, 'dark-theme');
    expect(localStorage.setItem).toHaveBeenCalledWith('compliance-classifier-theme', 'light');
  });

  it('should load theme from localStorage if available', () => {
    // Reset service to test initialization
    localStorageSpy.and.returnValue('dark');
    
    // Re-create service to test initialization
    service = TestBed.inject(ThemeService);
    
    expect(service.getCurrentTheme()).toBe('dark');
    expect(rendererMock.addClass).toHaveBeenCalledWith(document.body, 'dark-theme');
  });

  it('should use system preference if no theme in localStorage', () => {
    // Reset service to test initialization
    localStorageSpy.and.returnValue(null);
    (window.matchMedia as jasmine.Spy).and.returnValue({
      matches: true
    } as MediaQueryList);
    
    // Re-create service to test initialization
    service = TestBed.inject(ThemeService);
    
    expect(service.getCurrentTheme()).toBe('dark');
    expect(rendererMock.addClass).toHaveBeenCalledWith(document.body, 'dark-theme');
  });
});