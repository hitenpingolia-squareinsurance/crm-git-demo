import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFinalSalaryComponent } from './upload-final-salary.component';

describe('UploadFinalSalaryComponent', () => {
  let component: UploadFinalSalaryComponent;
  let fixture: ComponentFixture<UploadFinalSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFinalSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFinalSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
