import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeerenewalpopupComponent } from './employeerenewalpopup.component';

describe('EmployeerenewalpopupComponent', () => {
  let component: EmployeerenewalpopupComponent;
  let fixture: ComponentFixture<EmployeerenewalpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeerenewalpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeerenewalpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
