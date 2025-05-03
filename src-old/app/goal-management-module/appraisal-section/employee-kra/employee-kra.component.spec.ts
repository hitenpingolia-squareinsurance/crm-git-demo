import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeKraComponent } from './employee-kra.component';

describe('EmployeeKraComponent', () => {
  let component: EmployeeKraComponent;
  let fixture: ComponentFixture<EmployeeKraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeKraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeKraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
