import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFollowUpsComponent } from './add-follow-ups.component';

describe('AddFollowUpsComponent', () => {
  let component: AddFollowUpsComponent;
  let fixture: ComponentFixture<AddFollowUpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFollowUpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFollowUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
