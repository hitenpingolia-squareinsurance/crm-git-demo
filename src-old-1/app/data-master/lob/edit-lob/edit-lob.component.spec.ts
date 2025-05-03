import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLobComponent } from './edit-lob.component';

describe('EditLobComponent', () => {
  let component: EditLobComponent;
  let fixture: ComponentFixture<EditLobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
