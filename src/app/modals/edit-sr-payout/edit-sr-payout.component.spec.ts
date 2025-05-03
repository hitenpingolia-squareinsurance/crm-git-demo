import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSrPayoutComponent } from './edit-sr-payout.component';

describe('EditSrPayoutComponent', () => {
  let component: EditSrPayoutComponent;
  let fixture: ComponentFixture<EditSrPayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSrPayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSrPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
