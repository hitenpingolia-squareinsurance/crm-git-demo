import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyPayoutWalletComponent } from './early-payout-wallet.component';

describe('EarlyPayoutWalletComponent', () => {
  let component: EarlyPayoutWalletComponent;
  let fixture: ComponentFixture<EarlyPayoutWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarlyPayoutWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyPayoutWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
