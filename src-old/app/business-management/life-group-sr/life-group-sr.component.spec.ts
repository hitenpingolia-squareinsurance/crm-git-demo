import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeGroupSrComponent } from './life-group-sr.component';

describe('LifeGroupSrComponent', () => {
  let component: LifeGroupSrComponent;
  let fixture: ComponentFixture<LifeGroupSrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeGroupSrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeGroupSrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
