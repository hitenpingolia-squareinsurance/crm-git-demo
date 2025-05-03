import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeEndorsementTrackComponent } from './life-endorsement-track.component';

describe('LifeEndorsementTrackComponent', () => {
  let component: LifeEndorsementTrackComponent;
  let fixture: ComponentFixture<LifeEndorsementTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeEndorsementTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeEndorsementTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
