import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrRecoveryReportComponent } from './sr-recovery-report.component';

describe('SrRecoveryReportComponent', () => {
  let component: SrRecoveryReportComponent;
  let fixture: ComponentFixture<SrRecoveryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrRecoveryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrRecoveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
