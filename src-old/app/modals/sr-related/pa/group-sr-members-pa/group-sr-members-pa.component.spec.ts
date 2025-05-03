import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSrMembersPaComponent } from './group-sr-members-pa.component';

describe('GroupSrMembersPaComponent', () => {
  let component: GroupSrMembersPaComponent;
  let fixture: ComponentFixture<GroupSrMembersPaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSrMembersPaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSrMembersPaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
