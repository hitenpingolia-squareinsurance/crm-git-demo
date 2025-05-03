import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubManagerReportsComponent } from './club-manager-reports.component';

describe('ClubManagerReportsComponent', () => {
  let component: ClubManagerReportsComponent;
  let fixture: ComponentFixture<ClubManagerReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubManagerReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubManagerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
