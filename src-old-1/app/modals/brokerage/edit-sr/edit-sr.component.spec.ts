import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSrComponent } from './edit-sr.component';

describe('EditSrComponent', () => {
  let component: EditSrComponent;
  let fixture: ComponentFixture<EditSrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
