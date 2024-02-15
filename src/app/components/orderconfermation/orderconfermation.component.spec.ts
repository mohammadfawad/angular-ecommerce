import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderconfermationComponent } from './orderconfermation.component';

describe('OrderconfermationComponent', () => {
  let component: OrderconfermationComponent;
  let fixture: ComponentFixture<OrderconfermationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderconfermationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderconfermationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
