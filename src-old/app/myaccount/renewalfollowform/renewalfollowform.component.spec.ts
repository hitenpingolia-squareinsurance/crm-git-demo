import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalfollowformComponent } from './renewalfollowform.component';

describe('RenewalfollowformComponent', () => {
  let component: RenewalfollowformComponent;
  let fixture: ComponentFixture<RenewalfollowformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalfollowformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalfollowformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
