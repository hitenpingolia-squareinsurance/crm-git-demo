import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KraListComponent } from './kra-list.component';

describe('KraListComponent', () => {
  let component: KraListComponent;
  let fixture: ComponentFixture<KraListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KraListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
