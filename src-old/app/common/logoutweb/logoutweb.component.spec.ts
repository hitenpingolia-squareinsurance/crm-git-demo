import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutwebComponent } from './logoutweb.component';

describe('LogoutwebComponent', () => {
  let component: LogoutwebComponent;
  let fixture: ComponentFixture<LogoutwebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutwebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutwebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
