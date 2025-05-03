import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeMasterComponent } from './expense-type-master.component';

describe('ExpenseTypeMasterComponent', () => {
  let component: ExpenseTypeMasterComponent;
  let fixture: ComponentFixture<ExpenseTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
