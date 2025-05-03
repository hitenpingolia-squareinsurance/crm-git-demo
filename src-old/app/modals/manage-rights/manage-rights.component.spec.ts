import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRightsComponent } from './manage-rights.component';

describe('ManageRightsComponent', () => {
  let component: ManageRightsComponent;
  let fixture: ComponentFixture<ManageRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
