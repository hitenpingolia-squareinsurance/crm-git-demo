import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHealtQuoteComponent } from './view-healt-quote.component';

describe('ViewHealtQuoteComponent', () => {
  let component: ViewHealtQuoteComponent;
  let fixture: ComponentFixture<ViewHealtQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHealtQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHealtQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
