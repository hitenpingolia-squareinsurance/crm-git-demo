import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VahansComponent } from './vahans.component';

describe('VahansComponent', () => {
  let component: VahansComponent;
  let fixture: ComponentFixture<VahansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VahansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VahansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
