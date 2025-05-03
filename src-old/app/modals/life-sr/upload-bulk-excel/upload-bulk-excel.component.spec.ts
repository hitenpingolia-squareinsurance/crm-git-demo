import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBulkExcelComponent } from './upload-bulk-excel.component';

describe('UploadBulkExcelComponent', () => {
  let component: UploadBulkExcelComponent;
  let fixture: ComponentFixture<UploadBulkExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBulkExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBulkExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
