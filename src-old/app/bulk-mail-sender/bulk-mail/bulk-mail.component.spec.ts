import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMailComponent } from './bulk-mail.component';

describe('BulkMailComponent', () => {
  let component: BulkMailComponent;
  let fixture: ComponentFixture<BulkMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
