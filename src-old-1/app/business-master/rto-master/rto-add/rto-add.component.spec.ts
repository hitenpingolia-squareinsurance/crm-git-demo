import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtoAddComponent } from './rto-add.component';

describe('RtoAddComponent', () => {
  let component: RtoAddComponent;
  let fixture: ComponentFixture<RtoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
