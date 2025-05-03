import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOfflineQuoteComponent } from './view-offline-quote.component';

describe('ViewOfflineQuoteComponent', () => {
  let component: ViewOfflineQuoteComponent;
  let fixture: ComponentFixture<ViewOfflineQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOfflineQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOfflineQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
