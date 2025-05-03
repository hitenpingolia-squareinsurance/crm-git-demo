import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAchievementDetailsComponent } from './target-achievement-details.component';

describe('TargetAchievementDetailsComponent', () => {
  let component: TargetAchievementDetailsComponent;
  let fixture: ComponentFixture<TargetAchievementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetAchievementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetAchievementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
