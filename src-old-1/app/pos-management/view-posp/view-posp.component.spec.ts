import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPospComponent } from './view-posp.component';

describe('ViewPospComponent', () => {
  let component: ViewPospComponent;
  let fixture: ComponentFixture<ViewPospComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPospComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPospComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
