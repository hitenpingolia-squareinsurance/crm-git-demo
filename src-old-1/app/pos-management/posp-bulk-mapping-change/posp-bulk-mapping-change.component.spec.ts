import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PospBulkMappingChangeComponent } from './posp-bulk-mapping-change.component';

describe('PospBulkMappingChangeComponent', () => {
  let component: PospBulkMappingChangeComponent;
  let fixture: ComponentFixture<PospBulkMappingChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PospBulkMappingChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PospBulkMappingChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
