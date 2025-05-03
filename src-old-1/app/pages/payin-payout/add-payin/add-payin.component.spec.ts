import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayinComponent } from './add-payin.component';

describe('AddPayinComponent', () => {
  let component: AddPayinComponent;
  let fixture: ComponentFixture<AddPayinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
