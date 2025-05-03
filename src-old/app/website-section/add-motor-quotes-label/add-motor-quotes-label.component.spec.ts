import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMotorQuotesLabelComponent } from './add-motor-quotes-label.component';

describe('AddMotorQuotesLabelComponent', () => {
  let component: AddMotorQuotesLabelComponent;
  let fixture: ComponentFixture<AddMotorQuotesLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMotorQuotesLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMotorQuotesLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
