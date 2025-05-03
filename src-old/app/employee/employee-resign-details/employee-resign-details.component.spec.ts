import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeResignDetailsComponent } from './employee-resign-details.component';

describe('EmployeeResignDetailsComponent', () => {
  let component: EmployeeResignDetailsComponent;
  let fixture: ComponentFixture<EmployeeResignDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeResignDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeResignDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
