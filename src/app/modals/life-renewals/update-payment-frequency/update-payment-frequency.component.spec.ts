import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePaymentFrequencyComponent } from './update-payment-frequency.component';

describe('UpdatePaymentFrequencyComponent', () => {
  let component: UpdatePaymentFrequencyComponent;
  let fixture: ComponentFixture<UpdatePaymentFrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePaymentFrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePaymentFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
