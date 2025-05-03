import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSrEndorsementTrackComponent } from './group-sr-endorsement-track.component';

describe('GroupSrEndorsementTrackComponent', () => {
  let component: GroupSrEndorsementTrackComponent;
  let fixture: ComponentFixture<GroupSrEndorsementTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSrEndorsementTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSrEndorsementTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
