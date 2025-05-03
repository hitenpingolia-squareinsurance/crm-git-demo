import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmReportComponent } from './rm-report.component';

describe('RmReportComponent', () => {
  let component: RmReportComponent;
  let fixture: ComponentFixture<RmReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
