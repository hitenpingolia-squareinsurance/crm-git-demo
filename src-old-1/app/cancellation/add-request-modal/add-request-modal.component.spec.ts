import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestModalComponent } from './add-request-modal.component';

describe('AddRequestModalComponent', () => {
  let component: AddRequestModalComponent;
  let fixture: ComponentFixture<AddRequestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRequestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
