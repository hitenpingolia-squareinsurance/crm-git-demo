import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleReportsComponent } from './circle-reports.component';

describe('CircleReportsComponent', () => {
  let component: CircleReportsComponent;
  let fixture: ComponentFixture<CircleReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
