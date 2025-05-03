import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LwpRecordsComponent } from './lwp-records.component';

describe('LwpRecordsComponent', () => {
  let component: LwpRecordsComponent;
  let fixture: ComponentFixture<LwpRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LwpRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LwpRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
