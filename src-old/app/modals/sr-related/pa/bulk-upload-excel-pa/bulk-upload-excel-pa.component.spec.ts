import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadExcelPaComponent } from './bulk-upload-excel-pa.component';

describe('BulkUploadExcelPaComponent', () => {
  let component: BulkUploadExcelPaComponent;
  let fixture: ComponentFixture<BulkUploadExcelPaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadExcelPaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadExcelPaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
