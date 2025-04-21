import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccessibilityService, AccessibilityPreferences } from '../../../core/services/accessibility.service';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-accessibility-panel',
  templateUrl: './accessibility-panel.component.html',
  styleUrls: ['./accessibility-panel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    CheckboxModule,
    TooltipModule
  ]
})
export class AccessibilityPanelComponent implements OnInit {
  visible = false;
  preferences: AccessibilityPreferences = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderOptimized: false
  };

  constructor(private accessibilityService: AccessibilityService) { }

  ngOnInit(): void {
    this.accessibilityService.getPreferences().subscribe(prefs => {
      this.preferences = prefs;
    });
  }

  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }

  toggleHighContrast(): void {
    this.accessibilityService.toggleHighContrast();
  }

  toggleLargeText(): void {
    this.accessibilityService.toggleLargeText();
  }

  toggleReducedMotion(): void {
    this.accessibilityService.toggleReducedMotion();
  }

  toggleScreenReaderOptimized(): void {
    this.accessibilityService.toggleScreenReaderOptimized();
  }

  resetPreferences(): void {
    this.accessibilityService.resetPreferences();
  }
}