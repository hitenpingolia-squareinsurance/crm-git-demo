import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLeaderComponent } from './product-leader.component';

describe('ProductLeaderComponent', () => {
  let component: ProductLeaderComponent;
  let fixture: ComponentFixture<ProductLeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
