import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAspirantComponent } from './share-aspirant.component';

describe('ShareAspirantComponent', () => {
  let component: ShareAspirantComponent;
  let fixture: ComponentFixture<ShareAspirantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareAspirantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAspirantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
