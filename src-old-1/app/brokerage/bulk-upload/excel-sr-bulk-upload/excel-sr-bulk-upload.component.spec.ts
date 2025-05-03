import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelSrBulkUploadComponent } from './excel-sr-bulk-upload.component';

describe('ExcelSrBulkUploadComponent', () => {
  let component: ExcelSrBulkUploadComponent;
  let fixture: ComponentFixture<ExcelSrBulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelSrBulkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelSrBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
