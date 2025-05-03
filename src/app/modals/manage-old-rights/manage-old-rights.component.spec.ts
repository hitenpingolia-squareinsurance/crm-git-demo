import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOldRightsComponent } from './manage-old-rights.component';

describe('ManageOldRightsComponent', () => {
  let component: ManageOldRightsComponent;
  let fixture: ComponentFixture<ManageOldRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageOldRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOldRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
