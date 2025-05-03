import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMemberPaComponent } from './add-new-member-pa.component';

describe('AddNewMemberPaComponent', () => {
  let component: AddNewMemberPaComponent;
  let fixture: ComponentFixture<AddNewMemberPaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewMemberPaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMemberPaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
