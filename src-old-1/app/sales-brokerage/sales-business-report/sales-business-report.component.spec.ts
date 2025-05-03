import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBusinessReportComponent } from './sales-business-report.component';

describe('SalesBusinessReportComponent', () => {
  let component: SalesBusinessReportComponent;
  let fixture: ComponentFixture<SalesBusinessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesBusinessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesBusinessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
