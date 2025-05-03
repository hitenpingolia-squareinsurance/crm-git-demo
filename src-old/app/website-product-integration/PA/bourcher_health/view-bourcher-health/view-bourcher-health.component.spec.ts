import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBourcherHealthComponent } from './view-bourcher-health.component';

describe('ViewBourcherHealthComponent', () => {
  let component: ViewBourcherHealthComponent;
  let fixture: ComponentFixture<ViewBourcherHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBourcherHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBourcherHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
