import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYoutubeComponent } from './add-youtube.component';

describe('AddYoutubeComponent', () => {
  let component: AddYoutubeComponent;
  let fixture: ComponentFixture<AddYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
