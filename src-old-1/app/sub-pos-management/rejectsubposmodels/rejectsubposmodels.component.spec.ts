import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectsubposmodelsComponent } from './rejectsubposmodels.component';

describe('RejectsubposmodelsComponent', () => {
  let component: RejectsubposmodelsComponent;
  let fixture: ComponentFixture<RejectsubposmodelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectsubposmodelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectsubposmodelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
