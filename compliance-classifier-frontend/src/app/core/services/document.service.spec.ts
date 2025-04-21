import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { environment } from '../../../environments/environment';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService]
    });
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDocumentsByBatchId', () => {
    it('should return a list of documents for a batch', () => {
      const batchId = '1';
      const mockDocuments = [
        { id: 'd1', batchId: '1', filename: 'doc1.pdf', status: 'processed', uploadedAt: '2025-04-20T10:00:00Z' },
        { id: 'd2', batchId: '1', filename: 'doc2.pdf', status: 'processing', uploadedAt: '2025-04-20T10:05:00Z' }
      ];

      service.getDocumentsByBatchId(batchId).subscribe(documents => {
        expect(documents.length).toBe(2);
        expect(documents).toEqual(mockDocuments);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches/${batchId}/documents`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDocuments);
    });
  });

  describe('getDocumentById', () => {
    it('should return a single document by id', () => {
      const documentId = 'd1';
      const mockDocument = {
        id: 'd1',
        batchId: '1',
        filename: 'doc1.pdf',
        status: 'processed',
        uploadedAt: '2025-04-20T10:00:00Z',
        fileSize: 1024,
        contentType: 'application/pdf',
        classifications: [
          { category: 'Financial', confidence: 0.95 },
          { category: 'Contract', confidence: 0.75 }
        ]
      };

      service.getDocumentById(documentId).subscribe(document => {
        expect(document).toEqual(mockDocument);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/documents/${documentId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDocument);
    });

    it('should handle error when document not found', () => {
      const documentId = 'd999';
      
      service.getDocumentById(documentId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/documents/${documentId}`);
      expect(req.request.method).toBe('GET');
      req.flush('Document not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('uploadDocument', () => {
    it('should upload a document to a batch', () => {
      const batchId = '1';
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse = {
        id: 'd3',
        batchId: '1',
        filename: 'test.pdf',
        status: 'uploaded',
        uploadedAt: '2025-04-21T12:00:00Z',
        fileSize: mockFile.size,
        contentType: 'application/pdf'
      };

      service.uploadDocument(batchId, mockFile).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches/${batchId}/documents`);
      expect(req.request.method).toBe('POST');
      // FormData is used for file uploads, so we can't easily check the body
      expect(req.request.body instanceof FormData).toBeTrue();
      req.flush(mockResponse);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', () => {
      const documentId = 'd1';

      service.deleteDocument(documentId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/documents/${documentId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getDocumentContent', () => {
    it('should get document content as blob', () => {
      const documentId = 'd1';
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' });

      service.getDocumentContent(documentId).subscribe(content => {
        expect(content).toEqual(mockBlob);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/documents/${documentId}/content`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);
    });
  });
});