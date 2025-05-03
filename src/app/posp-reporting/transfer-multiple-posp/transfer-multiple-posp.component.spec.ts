import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferMultiplePospComponent } from './transfer-multiple-posp.component';

describe('TransferMultiplePospComponent', () => {
  let component: TransferMultiplePospComponent;
  let fixture: ComponentFixture<TransferMultiplePospComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferMultiplePospComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferMultiplePospComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
