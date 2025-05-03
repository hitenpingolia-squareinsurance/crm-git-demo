import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamstartpageComponent } from './examstartpage.component';

describe('ExamstartpageComponent', () => {
  let component: ExamstartpageComponent;
  let fixture: ComponentFixture<ExamstartpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamstartpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamstartpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
