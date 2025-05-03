import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadExcelHealthComponent } from './bulk-upload-excel-health.component';

describe('BulkUploadExcelHealthComponent', () => {
  let component: BulkUploadExcelHealthComponent;
  let fixture: ComponentFixture<BulkUploadExcelHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadExcelHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadExcelHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
