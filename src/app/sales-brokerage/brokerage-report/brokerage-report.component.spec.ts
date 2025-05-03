import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerageReportComponent } from './brokerage-report.component';

describe('BrokerageReportComponent', () => {
  let component: BrokerageReportComponent;
  let fixture: ComponentFixture<BrokerageReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerageReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
