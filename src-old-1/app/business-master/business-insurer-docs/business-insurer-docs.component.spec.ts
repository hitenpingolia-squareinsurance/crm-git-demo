import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInsurerDocsComponent } from './business-insurer-docs.component';

describe('BusinessInsurerDocsComponent', () => {
  let component: BusinessInsurerDocsComponent;
  let fixture: ComponentFixture<BusinessInsurerDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessInsurerDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessInsurerDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
