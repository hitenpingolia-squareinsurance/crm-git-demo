import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtoUpdateComponent } from './rto-update.component';

describe('RtoUpdateComponent', () => {
  let component: RtoUpdateComponent;
  let fixture: ComponentFixture<RtoUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtoUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
