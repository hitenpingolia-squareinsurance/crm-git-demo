import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNocComponent } from './view-noc.component';

describe('ViewNocComponent', () => {
  let component: ViewNocComponent;
  let fixture: ComponentFixture<ViewNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
