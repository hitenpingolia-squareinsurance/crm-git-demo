import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentTowardsComponent } from './add-payment-towards.component';

describe('AddPaymentTowardsComponent', () => {
  let component: AddPaymentTowardsComponent;
  let fixture: ComponentFixture<AddPaymentTowardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaymentTowardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentTowardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
