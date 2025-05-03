import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2PayinSalesListComponent } from './v2-payin-sales-list.component';

describe('V2PayinSalesListComponent', () => {
  let component: V2PayinSalesListComponent;
  let fixture: ComponentFixture<V2PayinSalesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2PayinSalesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2PayinSalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
