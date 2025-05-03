import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberPaComponent } from './edit-member-pa.component';

describe('EditMemberPaComponent', () => {
  let component: EditMemberPaComponent;
  let fixture: ComponentFixture<EditMemberPaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMemberPaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMemberPaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
