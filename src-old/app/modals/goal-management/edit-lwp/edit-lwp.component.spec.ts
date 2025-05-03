import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLwpComponent } from './edit-lwp.component';

describe('EditLwpComponent', () => {
  let component: EditLwpComponent;
  let fixture: ComponentFixture<EditLwpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLwpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
