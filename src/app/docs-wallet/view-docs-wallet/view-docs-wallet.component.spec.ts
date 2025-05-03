import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocsWalletComponent } from './view-docs-wallet.component';

describe('ViewDocsWalletComponent', () => {
  let component: ViewDocsWalletComponent;
  let fixture: ComponentFixture<ViewDocsWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDocsWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDocsWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
