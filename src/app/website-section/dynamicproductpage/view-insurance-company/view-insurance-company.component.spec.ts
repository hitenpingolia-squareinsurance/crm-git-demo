import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInsuranceCompanyComponent } from './view-insurance-company.component';

describe('ViewInsuranceCompanyComponent', () => {
  let component: ViewInsuranceCompanyComponent;
  let fixture: ComponentFixture<ViewInsuranceCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInsuranceCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInsuranceCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
