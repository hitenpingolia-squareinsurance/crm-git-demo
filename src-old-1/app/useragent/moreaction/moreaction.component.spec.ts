import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreactionComponent } from './moreaction.component';

describe('MoreactionComponent', () => {
  let component: MoreactionComponent;
  let fixture: ComponentFixture<MoreactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
