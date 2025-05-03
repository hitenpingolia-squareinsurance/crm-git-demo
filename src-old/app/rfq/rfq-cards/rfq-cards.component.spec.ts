import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqCardsComponent } from './rfq-cards.component';

describe('RfqCardsComponent', () => {
  let component: RfqCardsComponent;
  let fixture: ComponentFixture<RfqCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
