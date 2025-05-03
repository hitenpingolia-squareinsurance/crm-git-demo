import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineHealthRejectComponent } from './offline-health-reject.component';

describe('OfflineHealthRejectComponent', () => {
  let component: OfflineHealthRejectComponent;
  let fixture: ComponentFixture<OfflineHealthRejectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineHealthRejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineHealthRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
