import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalManagementDetailsComponent } from './goal-management-details.component';

describe('GoalManagementDetailsComponent', () => {
  let component: GoalManagementDetailsComponent;
  let fixture: ComponentFixture<GoalManagementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalManagementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalManagementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
