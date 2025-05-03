import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsReportComponent } from './lms-report.component';

describe('LmsReportComponent', () => {
  let component: LmsReportComponent;
  let fixture: ComponentFixture<LmsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
