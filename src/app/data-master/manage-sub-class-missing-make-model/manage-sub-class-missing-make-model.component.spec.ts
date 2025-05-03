import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubClassMissingMakeModelComponent } from './manage-sub-class-missing-make-model.component';

describe('ManageSubClassMissingMakeModelComponent', () => {
  let component: ManageSubClassMissingMakeModelComponent;
  let fixture: ComponentFixture<ManageSubClassMissingMakeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSubClassMissingMakeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubClassMissingMakeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
