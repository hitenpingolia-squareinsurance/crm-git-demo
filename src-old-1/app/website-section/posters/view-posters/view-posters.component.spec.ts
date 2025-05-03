import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPostersComponent } from './view-posters.component';

describe('ViewPostersComponent', () => {
  let component: ViewPostersComponent;
  let fixture: ComponentFixture<ViewPostersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPostersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPostersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
