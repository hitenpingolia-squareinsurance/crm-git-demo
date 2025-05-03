import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatationMisReportNameComponent } from './updatation-mis-report-name.component';

describe('UpdatationMisReportNameComponent', () => {
  let component: UpdatationMisReportNameComponent;
  let fixture: ComponentFixture<UpdatationMisReportNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatationMisReportNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatationMisReportNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
