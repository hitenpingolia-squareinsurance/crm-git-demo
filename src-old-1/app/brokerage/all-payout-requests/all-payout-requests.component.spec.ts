import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPayoutRequestsComponent } from './all-payout-requests.component';

describe('AllPayoutRequestsComponent', () => {
  let component: AllPayoutRequestsComponent;
  let fixture: ComponentFixture<AllPayoutRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPayoutRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPayoutRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
