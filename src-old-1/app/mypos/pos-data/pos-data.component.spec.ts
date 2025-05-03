import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDataComponent } from './pos-data.component';

describe('PosDataComponent', () => {
  let component: PosDataComponent;
  let fixture: ComponentFixture<PosDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
