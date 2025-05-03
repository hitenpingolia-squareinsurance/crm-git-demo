import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfrimPaymentMethodComponent } from './confrim-payment-method.component';

describe('ConfrimPaymentMethodComponent', () => {
  let component: ConfrimPaymentMethodComponent;
  let fixture: ComponentFixture<ConfrimPaymentMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfrimPaymentMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfrimPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
