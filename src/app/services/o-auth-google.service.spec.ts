import { TestBed } from '@angular/core/testing';

import { OAuthGoogleService } from './o-auth-google.service';

describe('OAuthGoogleService', () => {
  let service: OAuthGoogleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OAuthGoogleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
