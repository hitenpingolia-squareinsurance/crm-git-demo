import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDirectoryFollowupComponent } from './data-directory-followup.component';

describe('DataDirectoryFollowupComponent', () => {
  let component: DataDirectoryFollowupComponent;
  let fixture: ComponentFixture<DataDirectoryFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDirectoryFollowupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDirectoryFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
