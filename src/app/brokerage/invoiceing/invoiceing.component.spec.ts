import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceingComponent } from './invoiceing.component';

describe('InvoiceingComponent', () => {
  let component: InvoiceingComponent;
  let fixture: ComponentFixture<InvoiceingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
