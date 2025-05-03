import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLeadsComponent } from './show-leads.component';

describe('ShowLeadsComponent', () => {
  let component: ShowLeadsComponent;
  let fixture: ComponentFixture<ShowLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
