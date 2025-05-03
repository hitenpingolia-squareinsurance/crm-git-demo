import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRightsComponent } from './employee-rights.component';

describe('EmployeeRightsComponent', () => {
  let component: EmployeeRightsComponent;
  let fixture: ComponentFixture<EmployeeRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
