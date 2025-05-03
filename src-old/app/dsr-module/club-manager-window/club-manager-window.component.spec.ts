import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubManagerWindowComponent } from './club-manager-window.component';

describe('ClubManagerWindowComponent', () => {
  let component: ClubManagerWindowComponent;
  let fixture: ComponentFixture<ClubManagerWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubManagerWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubManagerWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
