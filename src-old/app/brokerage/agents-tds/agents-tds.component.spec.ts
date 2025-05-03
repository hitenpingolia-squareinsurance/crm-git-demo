import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsTdsComponent } from './agents-tds.component';

describe('AgentsTdsComponent', () => {
  let component: AgentsTdsComponent;
  let fixture: ComponentFixture<AgentsTdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentsTdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentsTdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
