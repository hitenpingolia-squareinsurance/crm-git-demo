import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHealthOfflineDetailsComponent } from './view-health-offline-details.component';

describe('ViewHealthOfflineDetailsComponent', () => {
  let component: ViewHealthOfflineDetailsComponent;
  let fixture: ComponentFixture<ViewHealthOfflineDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHealthOfflineDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHealthOfflineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
