import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVisitingCardComponent } from './view-visiting-card.component';

describe('ViewVisitingCardComponent', () => {
  let component: ViewVisitingCardComponent;
  let fixture: ComponentFixture<ViewVisitingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVisitingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVisitingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
