import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBusinessReportComponent } from './admin-business-report.component';

describe('AdminBusinessReportComponent', () => {
  let component: AdminBusinessReportComponent;
  let fixture: ComponentFixture<AdminBusinessReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBusinessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBusinessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
