import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppraisalDateComponent } from './update-appraisal-date.component';

describe('UpdateAppraisalDateComponent', () => {
  let component: UpdateAppraisalDateComponent;
  let fixture: ComponentFixture<UpdateAppraisalDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAppraisalDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAppraisalDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
