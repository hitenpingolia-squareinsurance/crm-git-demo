import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeRenewalsReportComponent } from './life-renewals-report.component';

describe('LifeRenewalsReportComponent', () => {
  let component: LifeRenewalsReportComponent;
  let fixture: ComponentFixture<LifeRenewalsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeRenewalsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeRenewalsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
