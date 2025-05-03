import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpcQcReportComponent } from './spc-qc-report.component';

describe('SpcQcReportComponent', () => {
  let component: SpcQcReportComponent;
  let fixture: ComponentFixture<SpcQcReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpcQcReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpcQcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
