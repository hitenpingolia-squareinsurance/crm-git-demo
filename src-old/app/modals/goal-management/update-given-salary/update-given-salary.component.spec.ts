import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGivenSalaryComponent } from './update-given-salary.component';

describe('UpdateGivenSalaryComponent', () => {
  let component: UpdateGivenSalaryComponent;
  let fixture: ComponentFixture<UpdateGivenSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateGivenSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGivenSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
