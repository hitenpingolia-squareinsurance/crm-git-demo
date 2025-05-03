import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrCreationReportComponent } from './sr-creation-report.component';

describe('SrCreationReportComponent', () => {
  let component: SrCreationReportComponent;
  let fixture: ComponentFixture<SrCreationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrCreationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrCreationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
