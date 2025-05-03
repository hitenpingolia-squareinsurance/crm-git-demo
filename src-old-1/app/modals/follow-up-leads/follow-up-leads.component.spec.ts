import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpLeadsComponent } from './follow-up-leads.component';

describe('FollowUpLeadsComponent', () => {
  let component: FollowUpLeadsComponent;
  let fixture: ComponentFixture<FollowUpLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
