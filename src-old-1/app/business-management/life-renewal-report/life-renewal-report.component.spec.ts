import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeRenewalReportComponent } from './life-renewal-report.component';

describe('LifeRenewalReportComponent', () => {
  let component: LifeRenewalReportComponent;
  let fixture: ComponentFixture<LifeRenewalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeRenewalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeRenewalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
