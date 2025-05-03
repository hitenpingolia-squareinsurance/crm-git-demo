import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalMeetingComponent } from './digital-meeting.component';

describe('DigitalMeetingComponent', () => {
  let component: DigitalMeetingComponent;
  let fixture: ComponentFixture<DigitalMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
