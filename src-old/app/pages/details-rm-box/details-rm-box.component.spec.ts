import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRmBoxComponent } from './details-rm-box.component';

describe('DetailsRmBoxComponent', () => {
  let component: DetailsRmBoxComponent;
  let fixture: ComponentFixture<DetailsRmBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsRmBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsRmBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
