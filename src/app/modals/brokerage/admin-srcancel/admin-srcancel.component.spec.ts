import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSRCancelComponent } from './admin-srcancel.component';

describe('AdminSRCancelComponent', () => {
  let component: AdminSRCancelComponent;
  let fixture: ComponentFixture<AdminSRCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSRCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSRCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
