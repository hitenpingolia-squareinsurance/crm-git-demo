import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2PayInRequestListComponent } from './v2-pay-in-request-list.component';

describe('V2PayInRequestListComponent', () => {
  let component: V2PayInRequestListComponent;
  let fixture: ComponentFixture<V2PayInRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2PayInRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2PayInRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
