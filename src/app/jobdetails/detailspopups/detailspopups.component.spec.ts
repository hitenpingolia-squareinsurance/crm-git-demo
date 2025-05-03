import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailspopupsComponent } from './detailspopups.component';

describe('DetailspopupsComponent', () => {
  let component: DetailspopupsComponent;
  let fixture: ComponentFixture<DetailspopupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailspopupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailspopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
