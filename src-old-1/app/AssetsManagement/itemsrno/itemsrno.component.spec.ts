import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsrnoComponent } from './itemsrno.component';

describe('ItemsrnoComponent', () => {
  let component: ItemsrnoComponent;
  let fixture: ComponentFixture<ItemsrnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsrnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsrnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
