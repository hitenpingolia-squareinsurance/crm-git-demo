import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrReportComponent } from './sr-report.component';

describe('SrReportComponent', () => {
  let component: SrReportComponent;
  let fixture: ComponentFixture<SrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
