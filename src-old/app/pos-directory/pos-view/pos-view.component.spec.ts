import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosViewComponent } from './pos-view.component';

describe('PosViewComponent', () => {
  let component: PosViewComponent;
  let fixture: ComponentFixture<PosViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
