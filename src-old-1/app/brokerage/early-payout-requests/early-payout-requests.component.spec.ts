import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyPayoutRequestsComponent } from './early-payout-requests.component';

describe('EarlyPayoutRequestsComponent', () => {
  let component: EarlyPayoutRequestsComponent;
  let fixture: ComponentFixture<EarlyPayoutRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarlyPayoutRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyPayoutRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
