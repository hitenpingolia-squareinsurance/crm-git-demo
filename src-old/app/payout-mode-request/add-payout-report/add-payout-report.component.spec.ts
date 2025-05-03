import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayoutReportComponent } from './add-payout-report.component';

describe('AddPayoutReportComponent', () => {
  let component: AddPayoutReportComponent;
  let fixture: ComponentFixture<AddPayoutReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayoutReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
