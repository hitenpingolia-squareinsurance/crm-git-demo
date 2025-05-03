import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedpaymenttracklogComponent } from './failedpaymenttracklog.component';

describe('FailedpaymenttracklogComponent', () => {
  let component: FailedpaymenttracklogComponent;
  let fixture: ComponentFixture<FailedpaymenttracklogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailedpaymenttracklogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedpaymenttracklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
