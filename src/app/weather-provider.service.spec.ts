import { TestBed } from '@angular/core/testing';

import { WeatherProviderService } from './weather-provider.service';

describe('WeatherProviderService', () => {
  let service: WeatherProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
