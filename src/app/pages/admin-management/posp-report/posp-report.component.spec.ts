import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PospReportComponent } from './posp-report.component';

describe('PospReportComponent', () => {
  let component: PospReportComponent;
  let fixture: ComponentFixture<PospReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PospReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PospReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
