import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgentRmaComponent } from './add-agent-rma.component';

describe('AddAgentRmaComponent', () => {
  let component: AddAgentRmaComponent;
  let fixture: ComponentFixture<AddAgentRmaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAgentRmaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgentRmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
