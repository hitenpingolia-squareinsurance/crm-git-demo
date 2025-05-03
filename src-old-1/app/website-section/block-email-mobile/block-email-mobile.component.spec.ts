import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockEmailMobileComponent } from './block-email-mobile.component';

describe('BlockEmailMobileComponent', () => {
  let component: BlockEmailMobileComponent;
  let fixture: ComponentFixture<BlockEmailMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockEmailMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockEmailMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
