import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JazzPaymentComponent } from './jazz-payment.component';

describe('JazzPaymentComponent', () => {
  let component: JazzPaymentComponent;
  let fixture: ComponentFixture<JazzPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JazzPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JazzPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
