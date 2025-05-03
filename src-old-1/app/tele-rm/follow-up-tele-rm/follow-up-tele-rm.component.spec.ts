import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpTeleRmComponent } from './follow-up-tele-rm.component';

describe('FollowUpTeleRmComponent', () => {
  let component: FollowUpTeleRmComponent;
  let fixture: ComponentFixture<FollowUpTeleRmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpTeleRmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpTeleRmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
