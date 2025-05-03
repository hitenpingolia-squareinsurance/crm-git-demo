import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCallBackComponent } from './schedule-call-back.component';

describe('ScheduleCallBackComponent', () => {
  let component: ScheduleCallBackComponent;
  let fixture: ComponentFixture<ScheduleCallBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleCallBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCallBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
