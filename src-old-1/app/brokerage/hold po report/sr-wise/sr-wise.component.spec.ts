import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrWiseComponent } from './sr-wise.component';

describe('SrWiseComponent', () => {
  let component: SrWiseComponent;
  let fixture: ComponentFixture<SrWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
