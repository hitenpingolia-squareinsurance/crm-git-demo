import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayInReportComponent } from './pay-in-report.component';

describe('PayInReportComponent', () => {
  let component: PayInReportComponent;
  let fixture: ComponentFixture<PayInReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayInReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayInReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
