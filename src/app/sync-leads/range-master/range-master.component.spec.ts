import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeMasterComponent } from './range-master.component';

describe('RangeMasterComponent', () => {
  let component: RangeMasterComponent;
  let fixture: ComponentFixture<RangeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
