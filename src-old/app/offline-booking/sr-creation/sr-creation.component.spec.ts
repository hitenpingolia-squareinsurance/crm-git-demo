import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrCreationComponent } from './sr-creation.component';

describe('SrCreationComponent', () => {
  let component: SrCreationComponent;
  let fixture: ComponentFixture<SrCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
