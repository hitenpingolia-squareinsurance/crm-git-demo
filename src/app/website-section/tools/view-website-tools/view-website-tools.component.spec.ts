import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWebsiteToolsComponent } from './view-website-tools.component';

describe('ViewWebsiteToolsComponent', () => {
  let component: ViewWebsiteToolsComponent;
  let fixture: ComponentFixture<ViewWebsiteToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWebsiteToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWebsiteToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
