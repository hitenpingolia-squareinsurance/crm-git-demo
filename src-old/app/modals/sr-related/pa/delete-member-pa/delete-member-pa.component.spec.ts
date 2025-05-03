import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMemberPaComponent } from './delete-member-pa.component';

describe('DeleteMemberPaComponent', () => {
  let component: DeleteMemberPaComponent;
  let fixture: ComponentFixture<DeleteMemberPaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMemberPaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMemberPaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
