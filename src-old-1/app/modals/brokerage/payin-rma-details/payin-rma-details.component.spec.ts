import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinRmaDetailsComponent } from './payin-rma-details.component';

describe('PayinRmaDetailsComponent', () => {
  let component: PayinRmaDetailsComponent;
  let fixture: ComponentFixture<PayinRmaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayinRmaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayinRmaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
