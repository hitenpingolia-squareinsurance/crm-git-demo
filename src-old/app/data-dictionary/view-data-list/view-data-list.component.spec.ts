import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDataListComponent } from './view-data-list.component';

describe('ViewDataListComponent', () => {
  let component: ViewDataListComponent;
  let fixture: ComponentFixture<ViewDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
