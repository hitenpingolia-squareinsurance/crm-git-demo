import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMemberHealthComponent } from './delete-member-health.component';

describe('DeleteMemberHealthComponent', () => {
  let component: DeleteMemberHealthComponent;
  let fixture: ComponentFixture<DeleteMemberHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMemberHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMemberHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
