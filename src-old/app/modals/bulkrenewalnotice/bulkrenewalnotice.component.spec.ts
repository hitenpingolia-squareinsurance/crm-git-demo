import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkrenewalnoticeComponent } from './bulkrenewalnotice.component';

describe('BulkrenewalnoticeComponent', () => {
  let component: BulkrenewalnoticeComponent;
  let fixture: ComponentFixture<BulkrenewalnoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkrenewalnoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkrenewalnoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
