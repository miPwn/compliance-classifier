import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BatchService } from './batch.service';
import { environment } from '../../../environments/environment';

describe('BatchService', () => {
  let service: BatchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BatchService]
    });
    service = TestBed.inject(BatchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBatches', () => {
    it('should return a list of batches', () => {
      const mockBatches = [
        { id: '1', name: 'Batch 1', createdAt: '2025-04-20T10:00:00Z', documentCount: 5 },
        { id: '2', name: 'Batch 2', createdAt: '2025-04-21T10:00:00Z', documentCount: 3 }
      ];

      service.getBatches().subscribe(batches => {
        expect(batches.length).toBe(2);
        expect(batches).toEqual(mockBatches);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBatches);
    });
  });

  describe('getBatchById', () => {
    it('should return a single batch by id', () => {
      const mockBatch = {
        id: '1',
        name: 'Batch 1',
        createdAt: '2025-04-20T10:00:00Z',
        documentCount: 5,
        documents: [
          { id: 'd1', filename: 'doc1.pdf', status: 'processed' },
          { id: 'd2', filename: 'doc2.pdf', status: 'processing' }
        ]
      };

      service.getBatchById('1').subscribe(batch => {
        expect(batch).toEqual(mockBatch);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBatch);
    });

    it('should handle error when batch not found', () => {
      service.getBatchById('999').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches/999`);
      expect(req.request.method).toBe('GET');
      req.flush('Batch not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createBatch', () => {
    it('should create a new batch', () => {
      const newBatch = { name: 'New Batch', description: 'Test batch' };
      const mockResponse = { id: '3', name: 'New Batch', description: 'Test batch', createdAt: '2025-04-21T12:00:00Z', documentCount: 0 };

      service.createBatch(newBatch).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBatch);
      req.flush(mockResponse);
    });
  });

  describe('updateBatch', () => {
    it('should update an existing batch', () => {
      const batchId = '1';
      const updateData = { name: 'Updated Batch', description: 'Updated description' };
      const mockResponse = { 
        id: '1', 
        name: 'Updated Batch', 
        description: 'Updated description',
        createdAt: '2025-04-20T10:00:00Z', 
        documentCount: 5 
      };

      service.updateBatch(batchId, updateData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches/${batchId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deleteBatch', () => {
    it('should delete a batch', () => {
      const batchId = '1';

      service.deleteBatch(batchId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/batches/${batchId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});