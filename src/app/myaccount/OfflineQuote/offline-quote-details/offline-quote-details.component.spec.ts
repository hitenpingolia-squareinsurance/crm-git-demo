import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineQuoteDetailsComponent } from './offline-quote-details.component';

describe('OfflineQuoteDetailsComponent', () => {
  let component: OfflineQuoteDetailsComponent;
  let fixture: ComponentFixture<OfflineQuoteDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineQuoteDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineQuoteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
