import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecruitmentRequestComponent } from './view-recruitment-request.component';

describe('ViewRecruitmentRequestComponent', () => {
  let component: ViewRecruitmentRequestComponent;
  let fixture: ComponentFixture<ViewRecruitmentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRecruitmentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecruitmentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
