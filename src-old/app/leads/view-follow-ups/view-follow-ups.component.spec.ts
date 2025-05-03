import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFollowUpsComponent } from './view-follow-ups.component';

describe('ViewFollowUpsComponent', () => {
  let component: ViewFollowUpsComponent;
  let fixture: ComponentFixture<ViewFollowUpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFollowUpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFollowUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
