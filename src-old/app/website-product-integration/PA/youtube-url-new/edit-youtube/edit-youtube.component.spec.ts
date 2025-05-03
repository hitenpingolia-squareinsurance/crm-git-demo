import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditYoutubeComponent } from './edit-youtube.component';

describe('EditYoutubeComponent', () => {
  let component: EditYoutubeComponent;
  let fixture: ComponentFixture<EditYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
