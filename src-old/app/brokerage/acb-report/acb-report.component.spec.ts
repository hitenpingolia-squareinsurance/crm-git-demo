import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcbReportComponent } from './acb-report.component';

describe('AcbReportComponent', () => {
  let component: AcbReportComponent;
  let fixture: ComponentFixture<AcbReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcbReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcbReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
