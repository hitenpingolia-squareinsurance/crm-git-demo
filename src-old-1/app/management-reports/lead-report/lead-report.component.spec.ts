import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadReportComponent } from './lead-report.component';

describe('LeadReportComponent', () => {
  let component: LeadReportComponent;
  let fixture: ComponentFixture<LeadReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
