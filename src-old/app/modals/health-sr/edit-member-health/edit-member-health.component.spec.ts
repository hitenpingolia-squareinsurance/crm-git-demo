import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberHealthComponent } from './edit-member-health.component';

describe('EditMemberHealthComponent', () => {
  let component: EditMemberHealthComponent;
  let fixture: ComponentFixture<EditMemberHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMemberHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMemberHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
