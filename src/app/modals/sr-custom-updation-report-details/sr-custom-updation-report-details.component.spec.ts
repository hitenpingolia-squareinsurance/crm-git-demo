import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrCustomUpdationReportDetailsComponent } from './sr-custom-updation-report-details.component';

describe('SrCustomUpdationReportDetailsComponent', () => {
  let component: SrCustomUpdationReportDetailsComponent;
  let fixture: ComponentFixture<SrCustomUpdationReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrCustomUpdationReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrCustomUpdationReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
