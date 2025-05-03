import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcTransferReportComponent } from './qc-transfer-report.component';

describe('QcTransferReportComponent', () => {
  let component: QcTransferReportComponent;
  let fixture: ComponentFixture<QcTransferReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcTransferReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcTransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
