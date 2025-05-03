import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMastersComponent } from './employee-masters.component';

describe('EmployeeMastersComponent', () => {
  let component: EmployeeMastersComponent;
  let fixture: ComponentFixture<EmployeeMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
