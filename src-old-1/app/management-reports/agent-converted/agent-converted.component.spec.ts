import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConvertedComponent } from './agent-converted.component';

describe('AgentConvertedComponent', () => {
  let component: AgentConvertedComponent;
  let fixture: ComponentFixture<AgentConvertedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentConvertedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentConvertedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
