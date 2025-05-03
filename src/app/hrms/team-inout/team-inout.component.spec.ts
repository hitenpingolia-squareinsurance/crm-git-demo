import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInoutComponent } from './team-inout.component';

describe('TeamInoutComponent', () => {
  let component: TeamInoutComponent;
  let fixture: ComponentFixture<TeamInoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamInoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
