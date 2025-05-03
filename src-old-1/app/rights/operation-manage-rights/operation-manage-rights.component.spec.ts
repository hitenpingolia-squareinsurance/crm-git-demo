import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationManageRightsComponent } from './operation-manage-rights.component';

describe('OperationManageRightsComponent', () => {
  let component: OperationManageRightsComponent;
  let fixture: ComponentFixture<OperationManageRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationManageRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationManageRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
