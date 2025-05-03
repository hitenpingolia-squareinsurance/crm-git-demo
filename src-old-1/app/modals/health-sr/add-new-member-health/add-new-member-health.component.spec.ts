import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMemberHealthComponent } from './add-new-member-health.component';

describe('AddNewMemberHealthComponent', () => {
  let component: AddNewMemberHealthComponent;
  let fixture: ComponentFixture<AddNewMemberHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewMemberHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMemberHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
