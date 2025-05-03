import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraLeadsComponent } from './extra-leads.component';

describe('ExtraLeadsComponent', () => {
  let component: ExtraLeadsComponent;
  let fixture: ComponentFixture<ExtraLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
