import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocsWalletComponent } from './add-docs-wallet.component';

describe('AddDocsWalletComponent', () => {
  let component: AddDocsWalletComponent;
  let fixture: ComponentFixture<AddDocsWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDocsWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocsWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
