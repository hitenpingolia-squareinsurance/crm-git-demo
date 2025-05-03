import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldPoReportComponent } from './hold-po-report.component';

describe('HoldPoReportComponent', () => {
  let component: HoldPoReportComponent;
  let fixture: ComponentFixture<HoldPoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldPoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldPoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
