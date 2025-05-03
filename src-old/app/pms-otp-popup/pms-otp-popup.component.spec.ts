import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsOtpPopupComponent } from './pms-otp-popup.component';

describe('PmsOtpPopupComponent', () => {
  let component: PmsOtpPopupComponent;
  let fixture: ComponentFixture<PmsOtpPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmsOtpPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmsOtpPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
