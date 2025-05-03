import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoPriorityLogsComponent } from './po-priority-logs.component';

describe('PoPriorityLogsComponent', () => {
  let component: PoPriorityLogsComponent;
  let fixture: ComponentFixture<PoPriorityLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoPriorityLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPriorityLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
