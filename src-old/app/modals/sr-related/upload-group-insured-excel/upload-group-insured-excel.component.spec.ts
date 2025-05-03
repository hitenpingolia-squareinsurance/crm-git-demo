import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGroupInsuredExcelComponent } from './upload-group-insured-excel.component';

describe('UploadGroupInsuredExcelComponent', () => {
  let component: UploadGroupInsuredExcelComponent;
  let fixture: ComponentFixture<UploadGroupInsuredExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadGroupInsuredExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadGroupInsuredExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
