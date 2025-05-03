import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsTargetBusinessDetailsComponent } from './pms-target-business-details.component';

describe('PmsTargetBusinessDetailsComponent', () => {
  let component: PmsTargetBusinessDetailsComponent;
  let fixture: ComponentFixture<PmsTargetBusinessDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmsTargetBusinessDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmsTargetBusinessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
