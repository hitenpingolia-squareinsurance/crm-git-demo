import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvetoryApprovalComponent } from './invetory-approval.component';

describe('InvetoryApprovalComponent', () => {
  let component: InvetoryApprovalComponent;
  let fixture: ComponentFixture<InvetoryApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvetoryApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvetoryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
