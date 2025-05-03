import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuoteComponent } from './manage-quote.component';

describe('ManageQuoteComponent', () => {
  let component: ManageQuoteComponent;
  let fixture: ComponentFixture<ManageQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
