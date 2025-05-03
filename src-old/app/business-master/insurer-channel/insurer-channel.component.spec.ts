import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurerChannelComponent } from './insurer-channel.component';

describe('InsurerChannelComponent', () => {
  let component: InsurerChannelComponent;
  let fixture: ComponentFixture<InsurerChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurerChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurerChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
