import { TestBed } from '@angular/core/testing';

import { JazzPaymentService } from './jazz-payment.service';

describe('JazzPaymentService', () => {
  let service: JazzPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JazzPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
