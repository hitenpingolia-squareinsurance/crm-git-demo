import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmEmployeesComponent } from './rm-employees.component';

describe('RmEmployeesComponent', () => {
  let component: RmEmployeesComponent;
  let fixture: ComponentFixture<RmEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
