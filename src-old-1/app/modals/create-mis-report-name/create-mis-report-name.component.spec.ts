import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMisReportNameComponent } from './create-mis-report-name.component';

describe('CreateMisReportNameComponent', () => {
  let component: CreateMisReportNameComponent;
  let fixture: ComponentFixture<CreateMisReportNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMisReportNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMisReportNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
