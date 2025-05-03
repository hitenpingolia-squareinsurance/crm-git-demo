import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewHolidayComponent } from './add-new-holiday.component';

describe('AddNewHolidayComponent', () => {
  let component: AddNewHolidayComponent;
  let fixture: ComponentFixture<AddNewHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
