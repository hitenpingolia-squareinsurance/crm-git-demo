import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecoveryComponent } from './add-recovery.component';

describe('AddRecoveryComponent', () => {
  let component: AddRecoveryComponent;
  let fixture: ComponentFixture<AddRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
