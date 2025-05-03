import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcChecklistComponent } from './qc-checklist.component';

describe('QcChecklistComponent', () => {
  let component: QcChecklistComponent;
  let fixture: ComponentFixture<QcChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
