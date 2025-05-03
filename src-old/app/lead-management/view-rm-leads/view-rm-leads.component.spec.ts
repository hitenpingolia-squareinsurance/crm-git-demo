import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRmLeadsComponent } from './view-rm-leads.component';

describe('ViewRmLeadsComponent', () => {
  let component: ViewRmLeadsComponent;
  let fixture: ComponentFixture<ViewRmLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRmLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRmLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
