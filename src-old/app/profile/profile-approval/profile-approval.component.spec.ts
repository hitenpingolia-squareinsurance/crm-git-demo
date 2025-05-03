import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileApprovalComponent } from './profile-approval.component';

describe('ProfileApprovalComponent', () => {
  let component: ProfileApprovalComponent;
  let fixture: ComponentFixture<ProfileApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
