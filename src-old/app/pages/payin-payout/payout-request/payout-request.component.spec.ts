import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutRequestComponent } from './payout-request.component';

describe('PayoutRequestComponent', () => {
  let component: PayoutRequestComponent;
  let fixture: ComponentFixture<PayoutRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
