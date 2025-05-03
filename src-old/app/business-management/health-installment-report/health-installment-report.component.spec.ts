import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInstallmentReportComponent } from './health-installment-report.component';

describe('HealthInstallmentReportComponent', () => {
  let component: HealthInstallmentReportComponent;
  let fixture: ComponentFixture<HealthInstallmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthInstallmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInstallmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
