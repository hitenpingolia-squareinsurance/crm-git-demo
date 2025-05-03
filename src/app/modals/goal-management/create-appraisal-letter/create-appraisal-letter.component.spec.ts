import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppraisalLetterComponent } from './create-appraisal-letter.component';

describe('CreateAppraisalLetterComponent', () => {
  let component: CreateAppraisalLetterComponent;
  let fixture: ComponentFixture<CreateAppraisalLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAppraisalLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppraisalLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
