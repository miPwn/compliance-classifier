import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { CreateBatchModalComponent } from './create-batch-modal.component';
import { BatchService } from '../../../../core/services/batch.service';

describe('CreateBatchModalComponent', () => {
  let component: CreateBatchModalComponent;
  let fixture: ComponentFixture<CreateBatchModalComponent>;
  let batchServiceSpy: jasmine.SpyObj<BatchService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const batchSpy = jasmine.createSpyObj('BatchService', ['createBatch']);
    const msgSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        CreateBatchModalComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BatchService, useValue: batchSpy },
        { provide: MessageService, useValue: msgSpy }
      ]
    }).compileComponents();

    batchServiceSpy = TestBed.inject(BatchService) as jasmine.SpyObj<BatchService>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    
    fixture = TestBed.createComponent(CreateBatchModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.batchForm).toBeTruthy();
    expect(component.batchForm.get('name')?.value).toBe('');
    expect(component.batchForm.get('description')?.value).toBe('');
  });

  it('should not be visible by default', () => {
    expect(component.visible).toBeFalse();
  });

  it('should show the modal when show() is called', () => {
    component.show();
    expect(component.visible).toBeTrue();
  });

  it('should hide the modal when hide() is called', () => {
    spyOn(component.modalClosed, 'emit');
    component.visible = true;
    
    component.hide();
    
    expect(component.visible).toBeFalse();
    expect(component.modalClosed.emit).toHaveBeenCalled();
  });

  it('should reset the form when resetForm() is called', () => {
    component.batchForm.setValue({
      name: 'Test Batch',
      description: 'Test Description'
    });
    component.submitting = true;
    
    component.resetForm();
    
    expect(component.batchForm.get('name')?.value).toBe('');
    expect(component.batchForm.get('description')?.value).toBe('');
    expect(component.submitting).toBeFalse();
  });

  it('should reset the form when show() is called', () => {
    spyOn(component, 'resetForm');
    
    component.show();
    
    expect(component.resetForm).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const nameControl = component.batchForm.get('name');
    
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalse();
    expect(nameControl?.hasError('required')).toBeTrue();
    
    nameControl?.setValue('Test Batch');
    expect(nameControl?.valid).toBeTrue();
  });

  it('should validate maxlength constraints', () => {
    const nameControl = component.batchForm.get('name');
    const descriptionControl = component.batchForm.get('description');
    
    nameControl?.setValue('a'.repeat(101));
    expect(nameControl?.valid).toBeFalse();
    expect(nameControl?.hasError('maxlength')).toBeTrue();
    
    descriptionControl?.setValue('a'.repeat(501));
    expect(descriptionControl?.valid).toBeFalse();
    expect(descriptionControl?.hasError('maxlength')).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    component.batchForm.setValue({
      name: '',
      description: ''
    });
    
    spyOn(component.batchForm.get('name')!, 'markAsTouched');
    spyOn(batchServiceSpy, 'createBatch');
    
    component.onSubmit();
    
    expect(component.batchForm.get('name')?.markAsTouched).toHaveBeenCalled();
    expect(batchServiceSpy.createBatch).not.toHaveBeenCalled();
  });

  it('should submit if form is valid', () => {
    component.batchForm.setValue({
      name: 'Test Batch',
      description: 'Test Description'
    });
    
    const mockBatch = {
      id: '1',
      name: 'Test Batch',
      description: 'Test Description',
      createdAt: new Date().toISOString(),
      documentCount: 0
    };
    
    batchServiceSpy.createBatch.and.returnValue(of(mockBatch));
    spyOn(component.batchCreated, 'emit');
    spyOn(component, 'hide');
    
    component.onSubmit();
    
    expect(component.submitting).toBeTrue();
    expect(batchServiceSpy.createBatch).toHaveBeenCalledWith({
      name: 'Test Batch',
      description: 'Test Description'
    });
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Batch Created',
      detail: 'Batch "Test Batch" has been created successfully'
    });
    expect(component.batchCreated.emit).toHaveBeenCalledWith(mockBatch);
    expect(component.hide).toHaveBeenCalled();
  });

  it('should handle error when creating batch', () => {
    component.batchForm.setValue({
      name: 'Test Batch',
      description: 'Test Description'
    });
    
    const errorResponse = { message: 'Creation failed' };
    batchServiceSpy.createBatch.and.returnValue(throwError(() => errorResponse));
    
    component.onSubmit();
    
    expect(component.submitting).toBeFalse();
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create batch: Creation failed'
    });
  });

  it('should check if a field is invalid and touched', () => {
    const nameControl = component.batchForm.get('name');
    
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    
    expect(component.isFieldInvalid('name')).toBeTrue();
    
    nameControl?.setValue('Test Batch');
    expect(component.isFieldInvalid('name')).toBeFalse();
  });

  it('should get error message for required field', () => {
    const nameControl = component.batchForm.get('name');
    
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    
    expect(component.getErrorMessage('name')).toBe('This field is required');
  });

  it('should get error message for maxlength field', () => {
    const nameControl = component.batchForm.get('name');
    
    nameControl?.setValue('a'.repeat(101));
    nameControl?.markAsTouched();
    
    expect(component.getErrorMessage('name')).toBe('Maximum length is 100 characters');
  });

  it('should return empty string for non-existent field', () => {
    expect(component.getErrorMessage('nonexistent')).toBe('');
  });

  it('should display validation errors in the template', () => {
    component.batchForm.get('name')?.setValue('');
    component.batchForm.get('name')?.markAsTouched();
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.p-error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toBe('This field is required');
  });

  it('should disable buttons when submitting', () => {
    component.submitting = true;
    fixture.detectChanges();
    
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons.forEach(button => {
      expect(button.attributes['ng-reflect-disabled']).toBe('true');
    });
  });

  it('should show loading state on create button when submitting', () => {
    component.submitting = true;
    fixture.detectChanges();
    
    const createButton = fixture.debugElement.queryAll(By.css('button'))[1];
    expect(createButton.attributes['ng-reflect-loading']).toBe('true');
  });

  it('should be responsive on different screen sizes', () => {
    component.visible = true;
    fixture.detectChanges();
    
    const dialog = fixture.debugElement.query(By.css('p-dialog'));
    expect(dialog).toBeTruthy();
    expect(dialog.attributes['ng-reflect-style']).toContain('width: 500px');
  });
});