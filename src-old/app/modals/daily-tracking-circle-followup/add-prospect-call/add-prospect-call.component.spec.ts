import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProspectCallComponent } from './add-prospect-call.component';

describe('AddProspectCallComponent', () => {
  let component: AddProspectCallComponent;
  let fixture: ComponentFixture<AddProspectCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProspectCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProspectCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
