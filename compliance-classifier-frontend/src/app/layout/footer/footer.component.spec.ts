import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FooterComponent } from './footer.component';
import { SharedModule } from '../../shared/shared.module';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [FooterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current year in the copyright text', () => {
    const currentYear = new Date().getFullYear().toString();
    const compiled = fixture.nativeElement;
    const copyrightText = compiled.querySelector('.copyright');
    
    expect(copyrightText.textContent).toContain(currentYear);
  });

  it('should display the version number', () => {
    component.version = '1.0.0';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const versionText = compiled.querySelector('.version');
    
    expect(versionText.textContent).toContain('1.0.0');
  });

  it('should have links to privacy policy and terms of service', () => {
    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('.footer-links a');
    
    expect(links.length).toBeGreaterThanOrEqual(2);
    
    const linkTexts = Array.from(links).map((link: HTMLElement) => link.textContent?.trim());
    expect(linkTexts).toContain('Privacy Policy');
    expect(linkTexts).toContain('Terms of Service');
  });
});