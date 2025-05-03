import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManageRequestComponent } from './view-manage-request.component';

describe('ViewManageRequestComponent', () => {
  let component: ViewManageRequestComponent;
  let fixture: ComponentFixture<ViewManageRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewManageRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManageRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
