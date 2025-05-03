import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanBenefitComponent } from './edit-plan-benefit.component';

describe('EditPlanBenefitComponent', () => {
  let component: EditPlanBenefitComponent;
  let fixture: ComponentFixture<EditPlanBenefitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlanBenefitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlanBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
