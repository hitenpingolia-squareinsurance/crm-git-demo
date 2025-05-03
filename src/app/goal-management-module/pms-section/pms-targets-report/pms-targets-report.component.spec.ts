import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsTargetsReportComponent } from './pms-targets-report.component';

describe('PmsTargetsReportComponent', () => {
  let component: PmsTargetsReportComponent;
  let fixture: ComponentFixture<PmsTargetsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmsTargetsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmsTargetsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
