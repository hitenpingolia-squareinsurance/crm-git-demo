import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusniessReportComponent } from './busniess-report.component';

describe('BusniessReportComponent', () => {
  let component: BusniessReportComponent;
  let fixture: ComponentFixture<BusniessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusniessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusniessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
