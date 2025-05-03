import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLobComponent } from './transfer-lob.component';

describe('TransferLobComponent', () => {
  let component: TransferLobComponent;
  let fixture: ComponentFixture<TransferLobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferLobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferLobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
