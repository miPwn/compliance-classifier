import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineService } from '../../../core/services/offline.service';
import { Observable, Subscription, interval, of } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// PrimeNG imports
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-offline-indicator',
  templateUrl: './offline-indicator.component.html',
  styleUrls: ['./offline-indicator.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    MessageModule
  ]
})
export class OfflineIndicatorComponent implements OnInit, OnDestroy {
  isOnline = true;
  pendingOperations = 0;
  offlineFeatureEnabled = environment.features.offlineSupport;
  
  private onlineStatusSubscription: Subscription | null = null;
  private pendingOperationsSubscription: Subscription | null = null;

  constructor(private offlineService: OfflineService) {}

  ngOnInit(): void {
    // Only set up subscriptions if offline support is enabled
    if (this.offlineFeatureEnabled) {
      // Update online status based on browser events
      this.isOnline = this.offlineService.isOnline();
      
      window.addEventListener('online', () => this.updateOnlineStatus(true));
      window.addEventListener('offline', () => this.updateOnlineStatus(false));
      
      // Poll for pending operations count every 5 seconds
      this.pendingOperationsSubscription = interval(5000)
        .pipe(
          startWith(0),
          switchMap(() => this.offlineService.getPendingOperationCount())
        )
        .subscribe(count => {
          this.pendingOperations = count;
        });
    }
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    window.removeEventListener('online', () => this.updateOnlineStatus(true));
    window.removeEventListener('offline', () => this.updateOnlineStatus(false));
    
    // Unsubscribe from observables
    if (this.onlineStatusSubscription) {
      this.onlineStatusSubscription.unsubscribe();
    }
    
    if (this.pendingOperationsSubscription) {
      this.pendingOperationsSubscription.unsubscribe();
    }
  }

  /**
   * Update the online status and trigger sync if coming back online
   */
  private updateOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    
    // If coming back online, trigger sync
    if (isOnline) {
      this.syncPendingOperations();
    }
  }

  /**
   * Manually trigger synchronization of pending operations
   */
  async syncPendingOperations(): Promise<void> {
    if (this.isOnline) {
      try {
        await this.offlineService.syncPendingOperations();
        // Refresh pending operations count
        this.offlineService.getPendingOperationCount()
          .subscribe(count => {
            this.pendingOperations = count;
          });
      } catch (error) {
        console.error('Error syncing pending operations:', error);
      }
    }
  }
}