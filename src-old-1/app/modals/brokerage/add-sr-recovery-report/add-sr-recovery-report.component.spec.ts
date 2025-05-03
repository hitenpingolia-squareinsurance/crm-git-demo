import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSrRecoveryReportComponent } from './add-sr-recovery-report.component';

describe('AddSrRecoveryReportComponent', () => {
  let component: AddSrRecoveryReportComponent;
  let fixture: ComponentFixture<AddSrRecoveryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSrRecoveryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSrRecoveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
