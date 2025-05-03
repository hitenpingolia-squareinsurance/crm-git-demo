import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicQuoteViewComponent } from './dynamic-quote-view.component';

describe('DynamicQuoteViewComponent', () => {
  let component: DynamicQuoteViewComponent;
  let fixture: ComponentFixture<DynamicQuoteViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicQuoteViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicQuoteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
