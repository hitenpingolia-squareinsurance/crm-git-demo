import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrPolicyReportsComponent } from './sr-policy-reports.component';

describe('SrPolicyReportsComponent', () => {
  let component: SrPolicyReportsComponent;
  let fixture: ComponentFixture<SrPolicyReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrPolicyReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrPolicyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
