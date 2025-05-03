import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanBenifitComponent } from './add-plan-benifit.component';

describe('AddPlanBenifitComponent', () => {
  let component: AddPlanBenifitComponent;
  let fixture: ComponentFixture<AddPlanBenifitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlanBenifitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlanBenifitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
