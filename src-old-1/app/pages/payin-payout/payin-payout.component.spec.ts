import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinPayoutComponent } from './payin-payout.component';

describe('PayinPayoutComponent', () => {
  let component: PayinPayoutComponent;
  let fixture: ComponentFixture<PayinPayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayinPayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayinPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
