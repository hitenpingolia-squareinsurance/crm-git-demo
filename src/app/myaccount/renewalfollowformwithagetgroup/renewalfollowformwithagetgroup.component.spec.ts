import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalfollowformwithagetgroupComponent } from './renewalfollowformwithagetgroup.component';

describe('RenewalfollowformwithagetgroupComponent', () => {
  let component: RenewalfollowformwithagetgroupComponent;
  let fixture: ComponentFixture<RenewalfollowformwithagetgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalfollowformwithagetgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalfollowformwithagetgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
