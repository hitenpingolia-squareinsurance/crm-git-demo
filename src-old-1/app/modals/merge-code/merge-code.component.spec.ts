import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeCodeComponent } from './merge-code.component';

describe('MergeCodeComponent', () => {
  let component: MergeCodeComponent;
  let fixture: ComponentFixture<MergeCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
