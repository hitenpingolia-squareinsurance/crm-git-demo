import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSrInsuredComponent } from './group-sr-insured.component';

describe('GroupSrInsuredComponent', () => {
  let component: GroupSrInsuredComponent;
  let fixture: ComponentFixture<GroupSrInsuredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSrInsuredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSrInsuredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
