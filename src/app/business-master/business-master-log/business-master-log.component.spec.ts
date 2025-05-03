import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMasterLogComponent } from './business-master-log.component';

describe('BusinessMasterLogComponent', () => {
  let component: BusinessMasterLogComponent;
  let fixture: ComponentFixture<BusinessMasterLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessMasterLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMasterLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
