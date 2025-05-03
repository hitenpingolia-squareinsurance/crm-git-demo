import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegulatoryReportsComponent } from './regulatory-reports.component';

describe('RegulatoryReportsComponent', () => {
  let component: RegulatoryReportsComponent;
  let fixture: ComponentFixture<RegulatoryReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegulatoryReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulatoryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
