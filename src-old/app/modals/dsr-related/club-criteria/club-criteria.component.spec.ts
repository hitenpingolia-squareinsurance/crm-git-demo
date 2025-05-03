import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubCriteriaComponent } from './club-criteria.component';

describe('ClubCriteriaComponent', () => {
  let component: ClubCriteriaComponent;
  let fixture: ComponentFixture<ClubCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
