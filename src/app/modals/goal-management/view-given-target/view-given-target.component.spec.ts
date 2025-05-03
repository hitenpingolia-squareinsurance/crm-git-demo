import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGivenTargetComponent } from './view-given-target.component';

describe('ViewGivenTargetComponent', () => {
  let component: ViewGivenTargetComponent;
  let fixture: ComponentFixture<ViewGivenTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGivenTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGivenTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
