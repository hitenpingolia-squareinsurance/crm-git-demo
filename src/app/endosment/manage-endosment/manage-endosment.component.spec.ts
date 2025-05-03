import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEndosmentComponent } from './manage-endosment.component';

describe('ManageEndosmentComponent', () => {
  let component: ManageEndosmentComponent;
  let fixture: ComponentFixture<ManageEndosmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageEndosmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEndosmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
