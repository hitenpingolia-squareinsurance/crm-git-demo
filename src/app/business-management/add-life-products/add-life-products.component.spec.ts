import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLifeProductsComponent } from './add-life-products.component';

describe('AddLifeProductsComponent', () => {
  let component: AddLifeProductsComponent;
  let fixture: ComponentFixture<AddLifeProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLifeProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLifeProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
