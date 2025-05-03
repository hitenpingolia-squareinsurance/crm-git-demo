import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectionTargetComponent } from './update-projection-target.component';

describe('UpdateProjectionTargetComponent', () => {
  let component: UpdateProjectionTargetComponent;
  let fixture: ComponentFixture<UpdateProjectionTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateProjectionTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProjectionTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
