import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCartComponent } from './detail-cart.component';

describe('DetailCartComponent', () => {
  let component: DetailCartComponent;
  let fixture: ComponentFixture<DetailCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
