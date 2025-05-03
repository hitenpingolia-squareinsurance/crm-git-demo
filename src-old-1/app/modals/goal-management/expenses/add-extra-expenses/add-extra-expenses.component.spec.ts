import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExtraExpensesComponent } from './add-extra-expenses.component';

describe('AddExtraExpensesComponent', () => {
  let component: AddExtraExpensesComponent;
  let fixture: ComponentFixture<AddExtraExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExtraExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExtraExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
