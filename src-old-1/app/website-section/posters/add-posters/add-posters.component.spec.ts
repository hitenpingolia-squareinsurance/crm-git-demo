import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostersComponent } from './add-posters.component';

describe('AddPostersComponent', () => {
  let component: AddPostersComponent;
  let fixture: ComponentFixture<AddPostersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPostersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
