import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckgridComponent } from './checkgrid.component';

describe('CheckgridComponent', () => {
  let component: CheckgridComponent;
  let fixture: ComponentFixture<CheckgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
