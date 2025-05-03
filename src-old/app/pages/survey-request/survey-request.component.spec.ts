import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyRequestComponent } from './survey-request.component';

describe('SurveyRequestComponent', () => {
  let component: SurveyRequestComponent;
  let fixture: ComponentFixture<SurveyRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
