import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlanBenifitComponent } from './view-plan-benifit.component';

describe('ViewPlanBenifitComponent', () => {
  let component: ViewPlanBenifitComponent;
  let fixture: ComponentFixture<ViewPlanBenifitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPlanBenifitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlanBenifitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
