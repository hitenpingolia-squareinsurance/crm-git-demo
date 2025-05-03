import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationReportComponent } from './activation-report.component';

describe('ActivationReportComponent', () => {
  let component: ActivationReportComponent;
  let fixture: ComponentFixture<ActivationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
