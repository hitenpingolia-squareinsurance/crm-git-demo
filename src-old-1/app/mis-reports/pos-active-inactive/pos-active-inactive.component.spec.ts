import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosActiveInactiveComponent } from './pos-active-inactive.component';

describe('PosActiveInactiveComponent', () => {
  let component: PosActiveInactiveComponent;
  let fixture: ComponentFixture<PosActiveInactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosActiveInactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosActiveInactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
