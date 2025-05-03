import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeCallComponent } from './add-employee-call.component';

describe('AddEmployeeCallComponent', () => {
  let component: AddEmployeeCallComponent;
  let fixture: ComponentFixture<AddEmployeeCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeeCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
