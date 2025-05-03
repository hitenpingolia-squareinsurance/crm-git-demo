import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPayoutRmComponent } from './edit-payout-rm.component';

describe('EditPayoutRmComponent', () => {
  let component: EditPayoutRmComponent;
  let fixture: ComponentFixture<EditPayoutRmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPayoutRmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPayoutRmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
