import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemsTransactionComponent } from './gems-transaction.component';

describe('GemsTransactionComponent', () => {
  let component: GemsTransactionComponent;
  let fixture: ComponentFixture<GemsTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemsTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GemsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
