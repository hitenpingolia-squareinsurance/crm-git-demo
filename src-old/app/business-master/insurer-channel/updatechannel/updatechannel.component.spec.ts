import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatechannelComponent } from './updatechannel.component';

describe('UpdatechannelComponent', () => {
  let component: UpdatechannelComponent;
  let fixture: ComponentFixture<UpdatechannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatechannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatechannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
