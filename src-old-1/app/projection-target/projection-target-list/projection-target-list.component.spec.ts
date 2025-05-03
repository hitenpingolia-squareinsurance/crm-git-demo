import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionTargetListComponent } from './projection-target-list.component';

describe('ProjectionTargetListComponent', () => {
  let component: ProjectionTargetListComponent;
  let fixture: ComponentFixture<ProjectionTargetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectionTargetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionTargetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
