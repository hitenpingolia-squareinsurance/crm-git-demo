import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalDateMasterComponent } from './appraisal-date-master.component';

describe('AppraisalDateMasterComponent', () => {
  let component: AppraisalDateMasterComponent;
  let fixture: ComponentFixture<AppraisalDateMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppraisalDateMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalDateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
