import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeProductsListComponent } from './life-products-list.component';

describe('LifeProductsListComponent', () => {
  let component: LifeProductsListComponent;
  let fixture: ComponentFixture<LifeProductsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeProductsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
