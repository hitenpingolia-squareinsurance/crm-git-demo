import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeleLeadsComponent } from './view-tele-leads.component';

describe('ViewTeleLeadsComponent', () => {
  let component: ViewTeleLeadsComponent;
  let fixture: ComponentFixture<ViewTeleLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTeleLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTeleLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
