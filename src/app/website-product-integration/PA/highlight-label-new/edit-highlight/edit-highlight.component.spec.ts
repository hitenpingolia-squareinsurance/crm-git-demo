import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHighlightComponent } from './edit-highlight.component';

describe('EditHighlightComponent', () => {
  let component: EditHighlightComponent;
  let fixture: ComponentFixture<EditHighlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
