import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManagerLeadsComponent } from './view-manager-leads.component';

describe('ViewManagerLeadsComponent', () => {
  let component: ViewManagerLeadsComponent;
  let fixture: ComponentFixture<ViewManagerLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewManagerLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManagerLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
