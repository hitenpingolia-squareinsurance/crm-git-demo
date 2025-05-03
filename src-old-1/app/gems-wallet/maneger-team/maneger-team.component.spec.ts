import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManegerTeamComponent } from './maneger-team.component';

describe('ManegerTeamComponent', () => {
  let component: ManegerTeamComponent;
  let fixture: ComponentFixture<ManegerTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManegerTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManegerTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
