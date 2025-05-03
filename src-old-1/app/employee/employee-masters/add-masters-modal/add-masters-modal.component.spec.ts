import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMastersModalComponent } from './add-masters-modal.component';

describe('AddMastersModalComponent', () => {
  let component: AddMastersModalComponent;
  let fixture: ComponentFixture<AddMastersModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMastersModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMastersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
