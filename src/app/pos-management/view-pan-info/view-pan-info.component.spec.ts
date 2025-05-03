import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPanInfoComponent } from './view-pan-info.component';

describe('ViewPanInfoComponent', () => {
  let component: ViewPanInfoComponent;
  let fixture: ComponentFixture<ViewPanInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPanInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
