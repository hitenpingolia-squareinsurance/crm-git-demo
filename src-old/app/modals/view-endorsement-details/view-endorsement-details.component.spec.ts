import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEndorsementDetailsComponent } from './view-endorsement-details.component';

describe('ViewEndorsementDetailsComponent', () => {
  let component: ViewEndorsementDetailsComponent;
  let fixture: ComponentFixture<ViewEndorsementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEndorsementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEndorsementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
