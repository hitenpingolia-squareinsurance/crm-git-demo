import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionTargetLogComponent } from './projection-target-log.component';

describe('ProjectionTargetLogComponent', () => {
  let component: ProjectionTargetLogComponent;
  let fixture: ComponentFixture<ProjectionTargetLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectionTargetLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionTargetLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
