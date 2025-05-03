import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateInsuranceComponent } from './corporate-insurance.component';

describe('CorporateInsuranceComponent', () => {
  let component: CorporateInsuranceComponent;
  let fixture: ComponentFixture<CorporateInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
