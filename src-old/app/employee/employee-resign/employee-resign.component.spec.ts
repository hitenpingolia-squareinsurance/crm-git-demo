import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeResignComponent } from './employee-resign.component';

describe('EmployeeResignComponent', () => {
  let component: EmployeeResignComponent;
  let fixture: ComponentFixture<EmployeeResignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeResignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeResignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
