import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeleRmComponent } from './view-tele-rm.component';

describe('ViewTeleRmComponent', () => {
  let component: ViewTeleRmComponent;
  let fixture: ComponentFixture<ViewTeleRmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTeleRmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTeleRmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
