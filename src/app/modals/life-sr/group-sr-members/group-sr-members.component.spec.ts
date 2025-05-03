import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSrMembersComponent } from './group-sr-members.component';

describe('GroupSrMembersComponent', () => {
  let component: GroupSrMembersComponent;
  let fixture: ComponentFixture<GroupSrMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSrMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSrMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
