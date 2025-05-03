import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmAgentEditComponent } from './rm-agent-edit.component';

describe('RmAgentEditComponent', () => {
  let component: RmAgentEditComponent;
  let fixture: ComponentFixture<RmAgentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmAgentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmAgentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
