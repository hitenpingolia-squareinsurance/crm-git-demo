import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GemsWalletComponent } from './gems-wallet.component';

describe('GemsWalletComponent', () => {
  let component: GemsWalletComponent;
  let fixture: ComponentFixture<GemsWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GemsWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GemsWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
