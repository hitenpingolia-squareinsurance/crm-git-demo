import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQsVeiwComponent } from './faqs-veiw.component';

describe('FAQsVeiwComponent', () => {
  let component: FAQsVeiwComponent;
  let fixture: ComponentFixture<FAQsVeiwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FAQsVeiwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FAQsVeiwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
