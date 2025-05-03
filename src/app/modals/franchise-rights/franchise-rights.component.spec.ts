import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseRightsComponent } from './franchise-rights.component';

describe('FranchiseRightsComponent', () => {
  let component: FranchiseRightsComponent;
  let fixture: ComponentFixture<FranchiseRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchiseRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchiseRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
