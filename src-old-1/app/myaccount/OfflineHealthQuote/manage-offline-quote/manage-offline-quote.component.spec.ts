import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOfflineQuoteComponent } from './manage-offline-quote.component';

describe('ManageOfflineQuoteComponent', () => {
  let component: ManageOfflineQuoteComponent;
  let fixture: ComponentFixture<ManageOfflineQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageOfflineQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOfflineQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
