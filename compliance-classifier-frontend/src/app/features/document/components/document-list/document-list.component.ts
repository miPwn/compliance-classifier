import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DocumentService, Document } from '../../../../core/services/document.service';
import { LazyLoadEvent } from 'primeng/api';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../../../environments/environment';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

interface DocumentFilter {
  search?: string;
  sortField?: string;
  sortOrder?: number;
  status?: string;
}

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    TooltipModule
  ]
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  totalDocuments = 0;
  isLoading = false;
  error: string | null = null;
  
  // Virtual scrolling configuration
  virtualScrollEnabled = environment.enableVirtualScrolling;
  
  // Filtering and sorting state
  filters: DocumentFilter = {};
  private searchSubject = new Subject<string>();

  constructor(
    private documentService: DocumentService,
    private router: Router
  ) {
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filters.search = searchTerm;
      this.loadDocuments({ first: 0, rows: 25 });
    });
  }

  ngOnInit(): void {
    // Initial load
    this.loadDocuments({ first: 0, rows: 25 });
  }

  /**
   * Load documents with lazy loading support
   * @param event LazyLoadEvent from PrimeNG table
   */
  loadDocuments(event: LazyLoadEvent): void {
    this.isLoading = true;
    this.error = null;
    
    const first = event.first || 0;
    const rows = event.rows || 25;
    
    // Update sorting if provided
    if (event.sortField) {
      this.filters.sortField = event.sortField.toString();
      this.filters.sortOrder = event.sortOrder || 1;
    }
    
    // In a real implementation, we would call the service with pagination, sorting, and filtering
    // For now, we'll simulate with mock data and setTimeout
    setTimeout(() => {
      // Generate more mock data for testing virtual scrolling
      const mockDocuments: Document[] = [];
      const totalCount = 1000; // Simulate a large dataset
      
      const startIndex = first;
      const endIndex = Math.min(first + rows, totalCount);
      
      for (let i = startIndex; i < endIndex; i++) {
        const isEven = i % 2 === 0;
        mockDocuments.push({
          id: i.toString(),
          batchId: '1',
          filename: `document${i}.${isEven ? 'pdf' : 'docx'}`,
          status: isEven ? 'Classified' : 'Pending',
          uploadedAt: '' + new Date(Date.now() - i * 3600000), // Stagger dates
          fileSize: Math.floor(Math.random() * 5000) + 500, // Random size between 500KB and 5500KB
          contentType: isEven ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      }
      
      // Apply search filter if present
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        this.documents = mockDocuments.filter(doc =>
          doc.filename.toLowerCase().includes(searchTerm) ||
          doc.status.toLowerCase().includes(searchTerm)
        );
        this.totalDocuments = this.documents ? (this.documents as any).length || 0 : 0;
      } else {
        this.documents = mockDocuments;
        this.totalDocuments = totalCount;
      }
      
      this.isLoading = false;
    }, 500); // Reduced timeout for better UX
  }

  /**
   * Handle search input
   * @param event Input event
   */
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  /**
   * Navigate to document details
   * @param documentId Document ID
   */
  viewDocument(documentId: string): void {
    this.router.navigate(['/documents', documentId]);
  }
}