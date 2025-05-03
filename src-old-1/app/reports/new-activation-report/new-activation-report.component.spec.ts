import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewActivationReportComponent } from './new-activation-report.component';

describe('NewActivationReportComponent', () => {
  let component: NewActivationReportComponent;
  let fixture: ComponentFixture<NewActivationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewActivationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewActivationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
