import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSectionDetailsComponent } from './view-section-details.component';

describe('ViewSectionDetailsComponent', () => {
  let component: ViewSectionDetailsComponent;
  let fixture: ComponentFixture<ViewSectionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSectionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
