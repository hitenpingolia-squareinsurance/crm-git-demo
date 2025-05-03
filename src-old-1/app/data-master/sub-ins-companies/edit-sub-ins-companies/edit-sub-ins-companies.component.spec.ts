import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubInsCompaniesComponent } from './edit-sub-ins-companies.component';

describe('EditSubInsCompaniesComponent', () => {
  let component: EditSubInsCompaniesComponent;
  let fixture: ComponentFixture<EditSubInsCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubInsCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubInsCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
