import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAchievementDetailsOldComponent } from './target-achievement-details-old.component';

describe('TargetAchievementDetailsOldComponent', () => {
  let component: TargetAchievementDetailsOldComponent;
  let fixture: ComponentFixture<TargetAchievementDetailsOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetAchievementDetailsOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetAchievementDetailsOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
