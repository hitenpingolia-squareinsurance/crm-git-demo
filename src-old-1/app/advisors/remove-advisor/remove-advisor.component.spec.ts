import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAdvisorComponent } from './remove-advisor.component';

describe('RemoveAdvisorComponent', () => {
  let component: RemoveAdvisorComponent;
  let fixture: ComponentFixture<RemoveAdvisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveAdvisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
