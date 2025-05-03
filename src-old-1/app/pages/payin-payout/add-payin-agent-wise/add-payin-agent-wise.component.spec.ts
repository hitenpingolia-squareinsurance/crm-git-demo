import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayinAgentWiseComponent } from './add-payin-agent-wise.component';

describe('AddPayinAgentWiseComponent', () => {
  let component: AddPayinAgentWiseComponent;
  let fixture: ComponentFixture<AddPayinAgentWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPayinAgentWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPayinAgentWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
