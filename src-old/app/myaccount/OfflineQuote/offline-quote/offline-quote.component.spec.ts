import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineQuoteComponent } from './offline-quote.component';

describe('OfflineQuoteComponent', () => {
  let component: OfflineQuoteComponent;
  let fixture: ComponentFixture<OfflineQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
