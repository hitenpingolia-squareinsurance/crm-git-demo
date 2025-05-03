import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamreportComponent } from './examreport.component';

describe('ExamreportComponent', () => {
  let component: ExamreportComponent;
  let fixture: ComponentFixture<ExamreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
