import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBusinessExtractComponent } from './view-business-extract.component';

describe('ViewBusinessExtractComponent', () => {
  let component: ViewBusinessExtractComponent;
  let fixture: ComponentFixture<ViewBusinessExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBusinessExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBusinessExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
