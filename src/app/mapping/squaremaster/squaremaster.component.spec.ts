import { async, ComponentFixture, TestBed } from '@angular/core/testing';
 
import { SquaremasterComponent } from './squaremaster.component';

describe('SquaremasterComponent', () => {
  let component: SquaremasterComponent;
  let fixture: ComponentFixture<SquaremasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquaremasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquaremasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
