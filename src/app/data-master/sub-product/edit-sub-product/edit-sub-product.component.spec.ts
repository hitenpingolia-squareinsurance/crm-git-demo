import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubProductComponent } from './edit-sub-product.component';

describe('EditSubProductComponent', () => {
  let component: EditSubProductComponent;
  let fixture: ComponentFixture<EditSubProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
