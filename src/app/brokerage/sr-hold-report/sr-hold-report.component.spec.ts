import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrHoldReportComponent } from './sr-hold-report.component';

describe('SrHoldReportComponent', () => {
  let component: SrHoldReportComponent;
  let fixture: ComponentFixture<SrHoldReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrHoldReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrHoldReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
