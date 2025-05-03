import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorQuotesLabelComponent } from './motor-quotes-label.component';

describe('MotorQuotesLabelComponent', () => {
  let component: MotorQuotesLabelComponent;
  let fixture: ComponentFixture<MotorQuotesLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotorQuotesLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorQuotesLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
