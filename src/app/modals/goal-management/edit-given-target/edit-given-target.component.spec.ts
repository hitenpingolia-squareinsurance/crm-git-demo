import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGivenTargetComponent } from './edit-given-target.component';

describe('EditGivenTargetComponent', () => {
  let component: EditGivenTargetComponent;
  let fixture: ComponentFixture<EditGivenTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGivenTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGivenTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
