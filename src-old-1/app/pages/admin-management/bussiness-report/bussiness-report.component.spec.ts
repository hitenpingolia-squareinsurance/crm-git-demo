import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessReportComponent } from './bussiness-report.component';

describe('BussinessReportComponent', () => {
  let component: BussinessReportComponent;
  let fixture: ComponentFixture<BussinessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BussinessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
