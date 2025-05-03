import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDynamicValueComponent } from './add-dynamic-value.component';

describe('AddDynamicValueComponent', () => {
  let component: AddDynamicValueComponent;
  let fixture: ComponentFixture<AddDynamicValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDynamicValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDynamicValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
