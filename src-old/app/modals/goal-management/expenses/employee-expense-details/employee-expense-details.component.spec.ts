import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeExpenseDetailsComponent } from './employee-expense-details.component';

describe('EmployeeExpenseDetailsComponent', () => {
  let component: EmployeeExpenseDetailsComponent;
  let fixture: ComponentFixture<EmployeeExpenseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeExpenseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeExpenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
