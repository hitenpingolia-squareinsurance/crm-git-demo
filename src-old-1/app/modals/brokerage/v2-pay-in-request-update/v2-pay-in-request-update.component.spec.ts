import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2PayInRequestUpdateComponent } from './v2-pay-in-request-update.component';

describe('V2PayInRequestUpdateComponent', () => {
  let component: V2PayInRequestUpdateComponent;
  let fixture: ComponentFixture<V2PayInRequestUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2PayInRequestUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2PayInRequestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
