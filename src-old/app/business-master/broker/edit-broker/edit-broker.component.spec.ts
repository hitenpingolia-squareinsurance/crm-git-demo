import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBrokerComponent } from './edit-broker.component';

describe('EditBrokerComponent', () => {
  let component: EditBrokerComponent;
  let fixture: ComponentFixture<EditBrokerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBrokerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
