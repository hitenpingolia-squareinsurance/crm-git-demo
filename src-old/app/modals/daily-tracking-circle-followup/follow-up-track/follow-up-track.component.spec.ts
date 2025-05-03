import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpTrackComponent } from './follow-up-track.component';

describe('FollowUpTrackComponent', () => {
  let component: FollowUpTrackComponent;
  let fixture: ComponentFixture<FollowUpTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
