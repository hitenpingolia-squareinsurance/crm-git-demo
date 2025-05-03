import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadExpenseExcelComponent } from './upload-expense-excel.component';

describe('UploadExpenseExcelComponent', () => {
  let component: UploadExpenseExcelComponent;
  let fixture: ComponentFixture<UploadExpenseExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadExpenseExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadExpenseExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
