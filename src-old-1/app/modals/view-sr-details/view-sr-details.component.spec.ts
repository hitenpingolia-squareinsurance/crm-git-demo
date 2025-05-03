import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSrDetailsComponent } from './view-sr-details.component';

describe('ViewSrDetailsComponent', () => {
  let component: ViewSrDetailsComponent;
  let fixture: ComponentFixture<ViewSrDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSrDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
