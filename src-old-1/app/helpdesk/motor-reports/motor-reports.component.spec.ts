import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorReportsComponent } from './motor-reports.component';

describe('MotorReportsComponent', () => {
  let component: MotorReportsComponent;
  let fixture: ComponentFixture<MotorReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotorReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
