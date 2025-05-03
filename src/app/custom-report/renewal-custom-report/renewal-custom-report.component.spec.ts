import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalCustomReportComponent } from './renewal-custom-report.component';

describe('RenewalCustomReportComponent', () => {
  let component: RenewalCustomReportComponent;
  let fixture: ComponentFixture<RenewalCustomReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalCustomReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalCustomReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
