import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcPdfReportComponent } from './qc-pdf-report.component';

describe('QcPdfReportComponent', () => {
  let component: QcPdfReportComponent;
  let fixture: ComponentFixture<QcPdfReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcPdfReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcPdfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
