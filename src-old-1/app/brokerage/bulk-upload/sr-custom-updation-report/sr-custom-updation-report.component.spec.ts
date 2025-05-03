import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrCustomUpdationReportComponent } from './sr-custom-updation-report.component';

describe('SrCustomUpdationReportComponent', () => {
  let component: SrCustomUpdationReportComponent;
  let fixture: ComponentFixture<SrCustomUpdationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrCustomUpdationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrCustomUpdationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
