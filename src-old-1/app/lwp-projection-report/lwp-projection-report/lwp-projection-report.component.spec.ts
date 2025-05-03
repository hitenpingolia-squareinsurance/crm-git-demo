import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LwpProjectionReportComponent } from './lwp-projection-report.component';

describe('LwpProjectionReportComponent', () => {
  let component: LwpProjectionReportComponent;
  let fixture: ComponentFixture<LwpProjectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LwpProjectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LwpProjectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
