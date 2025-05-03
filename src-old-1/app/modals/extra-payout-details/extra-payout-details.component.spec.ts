import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraPayoutDetailsComponent } from './extra-payout-details.component';

describe('ExtraPayoutDetailsComponent', () => {
  let component: ExtraPayoutDetailsComponent;
  let fixture: ComponentFixture<ExtraPayoutDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraPayoutDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraPayoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
