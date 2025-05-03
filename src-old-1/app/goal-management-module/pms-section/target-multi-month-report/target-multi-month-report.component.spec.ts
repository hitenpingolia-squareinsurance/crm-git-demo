import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetMultiMonthReportComponent } from './target-multi-month-report.component';

describe('TargetMultiMonthReportComponent', () => {
  let component: TargetMultiMonthReportComponent;
  let fixture: ComponentFixture<TargetMultiMonthReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetMultiMonthReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetMultiMonthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
