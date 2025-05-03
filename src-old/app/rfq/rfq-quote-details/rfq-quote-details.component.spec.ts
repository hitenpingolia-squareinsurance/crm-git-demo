import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqQuoteDetailsComponent } from './rfq-quote-details.component';

describe('RfqQuoteDetailsComponent', () => {
  let component: RfqQuoteDetailsComponent;
  let fixture: ComponentFixture<RfqQuoteDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqQuoteDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqQuoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
