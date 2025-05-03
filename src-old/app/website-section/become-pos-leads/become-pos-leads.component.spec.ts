import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomePosLeadsComponent } from './become-pos-leads.component';

describe('BecomePosLeadsComponent', () => {
  let component: BecomePosLeadsComponent;
  let fixture: ComponentFixture<BecomePosLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomePosLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomePosLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
