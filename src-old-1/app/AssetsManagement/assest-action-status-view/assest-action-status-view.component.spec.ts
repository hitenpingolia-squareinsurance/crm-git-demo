import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssestActionStatusViewComponent } from './assest-action-status-view.component';

describe('AssestActionStatusViewComponent', () => {
  let component: AssestActionStatusViewComponent;
  let fixture: ComponentFixture<AssestActionStatusViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssestActionStatusViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssestActionStatusViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
