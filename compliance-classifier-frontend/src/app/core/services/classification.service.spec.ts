import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClassificationService } from './classification.service';
import { environment } from '../../../environments/environment';

describe('ClassificationService', () => {
  let service: ClassificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClassificationService]
    });
    service = TestBed.inject(ClassificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getClassificationsByDocumentId', () => {
    it('should return classifications for a document', () => {
      const documentId = 'd1';
      const mockClassifications = [
        { id: 'c1', documentId: 'd1', category: 'Financial', confidence: 0.95, timestamp: '2025-04-20T10:30:00Z' },
        { id: 'c2', documentId: 'd1', category: 'Contract', confidence: 0.75, timestamp: '2025-04-20T10:30:00Z' }
      ];

      service.getClassificationsByDocumentId(documentId).subscribe(classifications => {
        expect(classifications.length).toBe(2);
        expect(classifications).toEqual(mockClassifications);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/documents/${documentId}/classifications`);
      expect(req.request.method).toBe('GET');
      req.flush(mockClassifications);
    });
  });

  describe('getClassificationCategories', () => {
    it('should return all available classification categories', () => {
      const mockCategories = [
        { id: 'cat1', name: 'Financial', description: 'Financial documents' },
        { id: 'cat2', name: 'Contract', description: 'Contract documents' },
        { id: 'cat3', name: 'Legal', description: 'Legal documents' }
      ];

      service.getClassificationCategories().subscribe(categories => {
        expect(categories.length).toBe(3);
        expect(categories).toEqual(mockCategories);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/classifications/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });

  describe('getClassificationStatsByBatchId', () => {
    it('should return classification statistics for a batch', () => {
      const batchId = '1';
      const mockStats = {
        totalDocuments: 5,
        classifiedDocuments: 4,
        pendingDocuments: 1,
        categoryDistribution: [
          { category: 'Financial', count: 3, percentage: 60 },
          { category: 'Contract', count: 2, percentage: 40 },
          { category: 'Legal', count: 1, percentage: 20 }
        ]
      };

      service.getClassificationStatsByBatchId(batchId).subscribe(stats => {
        expect(stats).toEqual(mockStats);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches/${batchId}/classifications/stats`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('updateClassification', () => {
    it('should update a classification', () => {
      const classificationId = 'c1';
      const updateData = { category: 'Updated Category', confidence: 0.85 };
      const mockResponse = {
        id: 'c1',
        documentId: 'd1',
        category: 'Updated Category',
        confidence: 0.85,
        timestamp: '2025-04-21T12:00:00Z'
      };

      service.updateClassification(classificationId, updateData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/classifications/${classificationId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('manualClassify', () => {
    it('should manually classify a document', () => {
      const documentId = 'd1';
      const classificationData = { category: 'Manual Category', confidence: 1.0 };
      const mockResponse = {
        id: 'c3',
        documentId: 'd1',
        category: 'Manual Category',
        confidence: 1.0,
        timestamp: '2025-04-21T12:00:00Z',
        isManual: true
      };

      service.manualClassify(documentId, classificationData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/documents/${documentId}/classify/manual`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(classificationData);
      req.flush(mockResponse);
    });
  });
});