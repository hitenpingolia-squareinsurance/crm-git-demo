import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssestViewComponent } from './assest-view.component';

describe('AssestViewComponent', () => {
  let component: AssestViewComponent;
  let fixture: ComponentFixture<AssestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
