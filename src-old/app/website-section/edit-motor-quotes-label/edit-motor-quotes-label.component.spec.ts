import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMotorQuotesLabelComponent } from './edit-motor-quotes-label.component';

describe('EditMotorQuotesLabelComponent', () => {
  let component: EditMotorQuotesLabelComponent;
  let fixture: ComponentFixture<EditMotorQuotesLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMotorQuotesLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMotorQuotesLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
