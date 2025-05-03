import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWebsiteToolsComponent } from './add-website-tools.component';

describe('AddWebsiteToolsComponent', () => {
  let component: AddWebsiteToolsComponent;
  let fixture: ComponentFixture<AddWebsiteToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWebsiteToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWebsiteToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
