import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRtoComponent } from './edit-rto.component';

describe('EditRtoComponent', () => {
  let component: EditRtoComponent;
  let fixture: ComponentFixture<EditRtoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRtoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
