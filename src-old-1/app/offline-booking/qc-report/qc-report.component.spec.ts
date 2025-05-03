import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcReportComponent } from './qc-report.component';

describe('QcReportComponent', () => {
  let component: QcReportComponent;
  let fixture: ComponentFixture<QcReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
