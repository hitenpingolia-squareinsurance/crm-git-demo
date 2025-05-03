import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRelatedFilterComponent } from './business-related-filter.component';

describe('BusinessRelatedFilterComponent', () => {
  let component: BusinessRelatedFilterComponent;
  let fixture: ComponentFixture<BusinessRelatedFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRelatedFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRelatedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
