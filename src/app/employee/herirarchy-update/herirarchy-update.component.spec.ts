import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HerirarchyUpdateComponent } from './herirarchy-update.component';

describe('HerirarchyUpdateComponent', () => {
  let component: HerirarchyUpdateComponent;
  let fixture: ComponentFixture<HerirarchyUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HerirarchyUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HerirarchyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
