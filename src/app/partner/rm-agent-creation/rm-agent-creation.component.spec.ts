import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmAgentCreationComponent } from './rm-agent-creation.component';

describe('RmAgentCreationComponent', () => {
  let component: RmAgentCreationComponent;
  let fixture: ComponentFixture<RmAgentCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmAgentCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmAgentCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
