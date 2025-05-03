import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTypeComponent } from './plan-type.component';

describe('PlanTypeComponent', () => {
  let component: PlanTypeComponent;
  let fixture: ComponentFixture<PlanTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
