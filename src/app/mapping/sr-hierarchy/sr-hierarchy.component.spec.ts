import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrHierarchyComponent } from './sr-hierarchy.component';

describe('SrHierarchyComponent', () => {
  let component: SrHierarchyComponent;
  let fixture: ComponentFixture<SrHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
