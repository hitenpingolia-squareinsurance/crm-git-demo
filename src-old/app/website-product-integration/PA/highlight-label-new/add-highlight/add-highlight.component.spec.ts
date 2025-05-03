import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHighlightComponent } from './add-highlight.component';

describe('AddHighlightComponent', () => {
  let component: AddHighlightComponent;
  let fixture: ComponentFixture<AddHighlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
