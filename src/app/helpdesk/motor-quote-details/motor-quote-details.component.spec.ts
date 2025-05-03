import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorQuoteDetailsComponent } from './motor-quote-details.component';

describe('MotorQuoteDetailsComponent', () => {
  let component: MotorQuoteDetailsComponent;
  let fixture: ComponentFixture<MotorQuoteDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotorQuoteDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorQuoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
