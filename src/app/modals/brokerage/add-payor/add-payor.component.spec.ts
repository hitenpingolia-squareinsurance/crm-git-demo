import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayorComponent } from './add-payor.component';

describe('AddPayorComponent', () => {
  let component: AddPayorComponent;
  let fixture: ComponentFixture<AddPayorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
