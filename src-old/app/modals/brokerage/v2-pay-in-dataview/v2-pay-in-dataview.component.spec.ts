import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2PayInDataviewComponent } from './v2-pay-in-dataview.component';

describe('V2PayInDataviewComponent', () => {
  let component: V2PayInDataviewComponent;
  let fixture: ComponentFixture<V2PayInDataviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2PayInDataviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2PayInDataviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
