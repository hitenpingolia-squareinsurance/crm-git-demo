import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosEnquiryComponent } from './pos-enquiry.component';

describe('PosEnquiryComponent', () => {
  let component: PosEnquiryComponent;
  let fixture: ComponentFixture<PosEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
