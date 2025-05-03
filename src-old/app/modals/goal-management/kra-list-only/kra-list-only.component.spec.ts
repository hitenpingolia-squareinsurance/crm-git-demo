import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KraListOnlyComponent } from './kra-list-only.component';

describe('KraListOnlyComponent', () => {
  let component: KraListOnlyComponent;
  let fixture: ComponentFixture<KraListOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KraListOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KraListOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
