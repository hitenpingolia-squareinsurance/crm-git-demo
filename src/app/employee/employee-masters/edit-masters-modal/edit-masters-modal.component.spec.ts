import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMastersModalComponent } from './edit-masters-modal.component';

describe('EditMastersModalComponent', () => {
  let component: EditMastersModalComponent;
  let fixture: ComponentFixture<EditMastersModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMastersModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMastersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
