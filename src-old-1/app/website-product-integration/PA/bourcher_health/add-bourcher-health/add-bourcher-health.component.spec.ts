import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBourcherHealthComponent } from './add-bourcher-health.component';

describe('AddBourcherHealthComponent', () => {
  let component: AddBourcherHealthComponent;
  let fixture: ComponentFixture<AddBourcherHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBourcherHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBourcherHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
