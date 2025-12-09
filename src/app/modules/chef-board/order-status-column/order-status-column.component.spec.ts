import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusColumnComponent } from './order-status-column.component';

describe('OrderStatusColumnComponent', () => {
  let component: OrderStatusColumnComponent;
  let fixture: ComponentFixture<OrderStatusColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusColumnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderStatusColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
