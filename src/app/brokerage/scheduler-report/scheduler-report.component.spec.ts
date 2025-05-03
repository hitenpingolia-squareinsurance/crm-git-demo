import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerReportComponent } from './scheduler-report.component';

describe('SchedulerReportComponent', () => {
  let component: SchedulerReportComponent;
  let fixture: ComponentFixture<SchedulerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
