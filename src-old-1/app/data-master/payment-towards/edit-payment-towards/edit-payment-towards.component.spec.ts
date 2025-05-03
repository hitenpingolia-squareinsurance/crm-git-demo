import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentTowardsComponent } from './edit-payment-towards.component';

describe('EditPaymentTowardsComponent', () => {
  let component: EditPaymentTowardsComponent;
  let fixture: ComponentFixture<EditPaymentTowardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPaymentTowardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentTowardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
