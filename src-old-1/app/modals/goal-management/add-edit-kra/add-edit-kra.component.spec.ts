import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditKraComponent } from './add-edit-kra.component';

describe('AddEditKraComponent', () => {
  let component: AddEditKraComponent;
  let fixture: ComponentFixture<AddEditKraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditKraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditKraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
