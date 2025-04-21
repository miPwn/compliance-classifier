import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class StatusBarComponent implements OnInit {
  messages: { severity: string; summary: string; detail: string; timestamp: Date }[] = [];
  private messageSubscription: Subscription | null = null;
  
  // Define message type
  private messageType = {
    severity: '',
    summary: '',
    detail: '',
    timestamp: new Date()
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Subscribe to message service to capture toast messages
    this.messageSubscription = this.messageService.messageObserver.subscribe((message: any) => {
      if (message) {
        // Handle both single message and array of messages
        const messages = Array.isArray(message) ? message : [message];
        
        // Process each message
        messages.forEach(msg => {
          // Add timestamp to message and ensure required properties
          const messageWithTimestamp = {
            severity: msg.severity || 'info',
            summary: msg.summary || '',
            detail: msg.detail || (msg as any).text || '',
            timestamp: new Date()
          };
          
          // Add to messages array
          this.messages.unshift(messageWithTimestamp);
          
          // Set timeout to automatically remove the message after 3 seconds
          setTimeout(() => {
            const index = this.messages.indexOf(messageWithTimestamp);
            if (index !== -1) {
              this.removeMessage(index);
            }
          }, 3000); // 3 seconds display time
        });
        
        // Keep only the last 5 messages
        while (this.messages.length > 5) {
          this.messages.pop();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  // Clear all messages
  clearMessages(): void {
    // Add fade-out class to all messages
    const messageElements = document.querySelectorAll('.status-message');
    messageElements.forEach((element) => {
      element.classList.add('fade-out');
    });
    
    // Wait for animation to complete before clearing
    setTimeout(() => {
      this.messages = [];
    }, 300);
  }

  // Remove a specific message
  removeMessage(index: number): void {
    // Get the DOM element for the message
    const messageElements = document.querySelectorAll('.status-message');
    if (messageElements && messageElements[index]) {
      const messageElement = messageElements[index] as HTMLElement;
      
      // Add the fade-out class
      messageElement.classList.add('fade-out');
      
      // Wait for the animation to complete before removing from array
      setTimeout(() => {
        this.messages.splice(index, 1);
      }, 300); // Match the animation duration
    } else {
      // If element not found, just remove from array
      this.messages.splice(index, 1);
    }
  }

  // Format timestamp
  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}