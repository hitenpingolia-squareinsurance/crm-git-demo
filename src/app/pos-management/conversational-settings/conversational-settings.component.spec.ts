import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationalSettingsComponent } from './conversational-settings.component';

describe('ConversationalSettingsComponent', () => {
  let component: ConversationalSettingsComponent;
  let fixture: ComponentFixture<ConversationalSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationalSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
