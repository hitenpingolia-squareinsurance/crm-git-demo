import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesubposComponent } from './createsubpos.component';

describe('CreatesubposComponent', () => {
  let component: CreatesubposComponent;
  let fixture: ComponentFixture<CreatesubposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatesubposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatesubposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
