import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTrackingCircleFollowupComponent } from './daily-tracking-circle-followup.component';

describe('DailyTrackingCircleFollowupComponent', () => {
  let component: DailyTrackingCircleFollowupComponent;
  let fixture: ComponentFixture<DailyTrackingCircleFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyTrackingCircleFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTrackingCircleFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
