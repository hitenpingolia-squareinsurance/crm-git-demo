import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EPartnerQuotationComponent } from './e-partner-quotation.component';

describe('EPartnerQuotationComponent', () => {
  let component: EPartnerQuotationComponent;
  let fixture: ComponentFixture<EPartnerQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EPartnerQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EPartnerQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
