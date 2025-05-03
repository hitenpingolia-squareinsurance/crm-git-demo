import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessFilterComponent } from './business-filter.component';

describe('BusinessFilterComponent', () => {
  let component: BusinessFilterComponent;
  let fixture: ComponentFixture<BusinessFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
