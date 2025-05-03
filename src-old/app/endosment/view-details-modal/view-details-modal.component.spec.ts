import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsModalComponent } from './view-details-modal.component';

describe('ViewDetailsModalComponent', () => {
  let component: ViewDetailsModalComponent;
  let fixture: ComponentFixture<ViewDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
