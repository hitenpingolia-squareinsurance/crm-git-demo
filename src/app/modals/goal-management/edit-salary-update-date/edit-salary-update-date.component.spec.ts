import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalaryUpdateDateComponent } from './edit-salary-update-date.component';

describe('EditSalaryUpdateDateComponent', () => {
  let component: EditSalaryUpdateDateComponent;
  let fixture: ComponentFixture<EditSalaryUpdateDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSalaryUpdateDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSalaryUpdateDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
