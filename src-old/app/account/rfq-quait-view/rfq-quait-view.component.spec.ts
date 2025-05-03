import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqQuaitViewComponent } from './rfq-quait-view.component';

describe('RfqQuaitViewComponent', () => {
  let component: RfqQuaitViewComponent;
  let fixture: ComponentFixture<RfqQuaitViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqQuaitViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqQuaitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
