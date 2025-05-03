import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleyawardsComponent } from './galleyawards.component';

describe('GalleyawardsComponent', () => {
  let component: GalleyawardsComponent;
  let fixture: ComponentFixture<GalleyawardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleyawardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleyawardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
