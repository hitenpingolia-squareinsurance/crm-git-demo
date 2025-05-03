import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDiscriptionMasterComponent } from './invoice-discription-master.component';

describe('InvoiceDiscriptionMasterComponent', () => {
  let component: InvoiceDiscriptionMasterComponent;
  let fixture: ComponentFixture<InvoiceDiscriptionMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDiscriptionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDiscriptionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
