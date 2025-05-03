import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTowardsComponent } from './payment-towards.component';

describe('PaymentTowardsComponent', () => {
  let component: PaymentTowardsComponent;
  let fixture: ComponentFixture<PaymentTowardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTowardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTowardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
