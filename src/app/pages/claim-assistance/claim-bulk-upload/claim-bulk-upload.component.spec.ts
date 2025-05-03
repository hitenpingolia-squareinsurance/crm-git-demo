import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimBulkUploadComponent } from './claim-bulk-upload.component';

describe('ClaimBulkUploadComponent', () => {
  let component: ClaimBulkUploadComponent;
  let fixture: ComponentFixture<ClaimBulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimBulkUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
