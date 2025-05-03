import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayOutRequestComponent } from './pay-out-request.component';

describe('PayOutRequestComponent', () => {
  let component: PayOutRequestComponent;
  let fixture: ComponentFixture<PayOutRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayOutRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayOutRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
