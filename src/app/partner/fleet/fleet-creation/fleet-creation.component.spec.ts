import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCreationComponent } from './fleet-creation.component';

describe('FleetCreationComponent', () => {
  let component: FleetCreationComponent;
  let fixture: ComponentFixture<FleetCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
