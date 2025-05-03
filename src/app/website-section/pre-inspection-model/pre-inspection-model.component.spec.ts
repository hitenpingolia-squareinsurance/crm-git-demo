import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreInspectionModelComponent } from './pre-inspection-model.component';

describe('PreInspectionModelComponent', () => {
  let component: PreInspectionModelComponent;
  let fixture: ComponentFixture<PreInspectionModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreInspectionModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreInspectionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
