import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PospReportsComponent } from './posp-reports.component';

describe('PospReportsComponent', () => {
  let component: PospReportsComponent;
  let fixture: ComponentFixture<PospReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PospReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PospReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
