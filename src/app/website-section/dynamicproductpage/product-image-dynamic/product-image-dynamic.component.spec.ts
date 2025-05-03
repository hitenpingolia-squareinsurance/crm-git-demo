import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageDynamicComponent } from './product-image-dynamic.component';

describe('ProductImageDynamicComponent', () => {
  let component: ProductImageDynamicComponent;
  let fixture: ComponentFixture<ProductImageDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImageDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImageDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
