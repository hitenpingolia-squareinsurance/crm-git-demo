import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpProductComponent } from './follow-up-product.component';

describe('FollowUpProductComponent', () => {
  let component: FollowUpProductComponent;
  let fixture: ComponentFixture<FollowUpProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowUpProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
