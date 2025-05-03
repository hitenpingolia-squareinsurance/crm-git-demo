import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMappingComponent } from './bulk-mapping.component';

describe('BulkMappingComponent', () => {
  let component: BulkMappingComponent;
  let fixture: ComponentFixture<BulkMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
