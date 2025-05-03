import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSrMembersHealthComponent } from './group-sr-members-health.component';

describe('GroupSrMembersHealthComponent', () => {
  let component: GroupSrMembersHealthComponent;
  let fixture: ComponentFixture<GroupSrMembersHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSrMembersHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSrMembersHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
