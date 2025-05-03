import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEndosmentComponent } from './view-endosment.component';

describe('ViewEndosmentComponent', () => {
  let component: ViewEndosmentComponent;
  let fixture: ComponentFixture<ViewEndosmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEndosmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEndosmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
