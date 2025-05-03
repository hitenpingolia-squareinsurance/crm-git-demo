import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsViewComponent } from './rights-view.component';

describe('RightsViewComponent', () => {
  let component: RightsViewComponent;
  let fixture: ComponentFixture<RightsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
