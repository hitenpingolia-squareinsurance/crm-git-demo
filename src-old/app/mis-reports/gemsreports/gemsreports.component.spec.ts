import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemsreportsComponent } from './gemsreports.component';

describe('GemsreportsComponent', () => {
  let component: GemsreportsComponent;
  let fixture: ComponentFixture<GemsreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemsreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GemsreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
