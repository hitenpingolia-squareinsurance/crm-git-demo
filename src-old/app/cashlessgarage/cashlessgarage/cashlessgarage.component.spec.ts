import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashlessgarageComponent } from './cashlessgarage.component';

describe('CashlessgarageComponent', () => {
  let component: CashlessgarageComponent;
  let fixture: ComponentFixture<CashlessgarageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashlessgarageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashlessgarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
