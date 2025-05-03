import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanUpdateComponent } from './plan-update.component';

describe('PlanUpdateComponent', () => {
  let component: PlanUpdateComponent;
  let fixture: ComponentFixture<PlanUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
