import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutPostingComponent } from './payout-posting.component';

describe('PayoutPostingComponent', () => {
  let component: PayoutPostingComponent;
  let fixture: ComponentFixture<PayoutPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
