import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveInactiveComponent } from './active-inactive.component';

describe('ActiveInactiveComponent', () => {
  let component: ActiveInactiveComponent;
  let fixture: ComponentFixture<ActiveInactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveInactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
