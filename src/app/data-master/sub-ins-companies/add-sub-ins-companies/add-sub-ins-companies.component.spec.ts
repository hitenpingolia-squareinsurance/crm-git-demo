import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubInsCompaniesComponent } from './add-sub-ins-companies.component';

describe('AddSubInsCompaniesComponent', () => {
  let component: AddSubInsCompaniesComponent;
  let fixture: ComponentFixture<AddSubInsCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubInsCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubInsCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
