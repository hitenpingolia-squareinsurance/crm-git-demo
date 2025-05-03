import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesPayoutRequestsComponent } from './files-payout-request.component';

describe('FilesPayoutRequestsComponent', () => {
  let component: FilesPayoutRequestsComponent;
  let fixture: ComponentFixture<FilesPayoutRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesPayoutRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesPayoutRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
