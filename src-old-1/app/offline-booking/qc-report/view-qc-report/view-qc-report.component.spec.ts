import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQcReportComponent } from './view-qc-report.component';

describe('ViewQcReportComponent', () => {
  let component: ViewQcReportComponent;
  let fixture: ComponentFixture<ViewQcReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQcReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQcReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
