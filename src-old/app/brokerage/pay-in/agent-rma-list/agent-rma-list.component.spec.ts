import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRmaListComponent } from './agent-rma-list.component';

describe('AgentRmaListComponent', () => {
  let component: AgentRmaListComponent;
  let fixture: ComponentFixture<AgentRmaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentRmaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentRmaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
