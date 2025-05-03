import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSalaryDetailsComponent } from './update-salary-details.component';

describe('UpdateSalaryDetailsComponent', () => {
  let component: UpdateSalaryDetailsComponent;
  let fixture: ComponentFixture<UpdateSalaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSalaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSalaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
