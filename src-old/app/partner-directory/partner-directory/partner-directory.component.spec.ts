import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDirectoryComponent } from './partner-directory.component';

describe('PartnerDirectoryComponent', () => {
  let component: PartnerDirectoryComponent;
  let fixture: ComponentFixture<PartnerDirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
