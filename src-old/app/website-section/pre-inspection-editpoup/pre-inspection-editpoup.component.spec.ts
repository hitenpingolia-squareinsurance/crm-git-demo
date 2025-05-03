import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreInspectionEditpoupComponent } from './pre-inspection-editpoup.component';

describe('PreInspectionEditpoupComponent', () => {
  let component: PreInspectionEditpoupComponent;
  let fixture: ComponentFixture<PreInspectionEditpoupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreInspectionEditpoupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreInspectionEditpoupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
