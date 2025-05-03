import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubProductComponent } from './add-sub-product.component';

describe('AddSubProductComponent', () => {
  let component: AddSubProductComponent;
  let fixture: ComponentFixture<AddSubProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
