import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManagerRequestComponent } from './view-manager-request.component';

describe('ViewManagerRequestComponent', () => {
  let component: ViewManagerRequestComponent;
  let fixture: ComponentFixture<ViewManagerRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewManagerRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManagerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
