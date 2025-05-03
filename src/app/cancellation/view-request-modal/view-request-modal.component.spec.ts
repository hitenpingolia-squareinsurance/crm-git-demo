import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestModalComponent } from './view-request-modal.component';

describe('ViewRequestModalComponent', () => {
  let component: ViewRequestModalComponent;
  let fixture: ComponentFixture<ViewRequestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
