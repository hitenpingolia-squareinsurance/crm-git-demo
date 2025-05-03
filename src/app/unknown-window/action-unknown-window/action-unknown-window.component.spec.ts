import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionUnknownWindowComponent } from './action-unknown-window.component';

describe('ActionUnknownWindowComponent', () => {
  let component: ActionUnknownWindowComponent;
  let fixture: ComponentFixture<ActionUnknownWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionUnknownWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionUnknownWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
