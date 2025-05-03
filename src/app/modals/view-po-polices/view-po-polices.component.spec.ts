import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPoPolicesComponent } from './view-po-polices.component';

describe('ViewPoPolicesComponent', () => {
  let component: ViewPoPolicesComponent;
  let fixture: ComponentFixture<ViewPoPolicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPoPolicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPoPolicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
