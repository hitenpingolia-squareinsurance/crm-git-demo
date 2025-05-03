import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineHealthDetailsComponent } from './offline-health-details.component';

describe('OfflineHealthDetailsComponent', () => {
  let component: OfflineHealthDetailsComponent;
  let fixture: ComponentFixture<OfflineHealthDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineHealthDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineHealthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
