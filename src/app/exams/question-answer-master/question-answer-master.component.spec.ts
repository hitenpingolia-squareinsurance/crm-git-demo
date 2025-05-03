import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerMasterComponent } from './question-answer-master.component';

describe('QuestionAnswerMasterComponent', () => {
  let component: QuestionAnswerMasterComponent;
  let fixture: ComponentFixture<QuestionAnswerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnswerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
