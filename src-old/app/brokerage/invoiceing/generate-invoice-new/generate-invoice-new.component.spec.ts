import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateInvoiceNewComponent } from './generate-invoice-new.component';

describe('GenerateInvoiceNewComponent', () => {
  let component: GenerateInvoiceNewComponent;
  let fixture: ComponentFixture<GenerateInvoiceNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateInvoiceNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateInvoiceNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
