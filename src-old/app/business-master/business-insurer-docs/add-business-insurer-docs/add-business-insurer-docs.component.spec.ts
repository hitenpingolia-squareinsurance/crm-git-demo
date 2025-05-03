import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessInsurerDocsComponent } from './add-business-insurer-docs.component';

describe('AddBusinessInsurerDocsComponent', () => {
  let component: AddBusinessInsurerDocsComponent;
  let fixture: ComponentFixture<AddBusinessInsurerDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusinessInsurerDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessInsurerDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
