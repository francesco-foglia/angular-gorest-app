import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request', () => {
    const mockData = { /* your mock data here */ };
    const endpoint = 'example';

    service.get(endpoint).subscribe(response => {
      expect(response.body).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${endpoint}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData, { status: 200, statusText: 'OK' });
  });

  it('should make a POST request', () => {
    const mockData = { /* your mock data here */ };
    const endpoint = 'example';
    const postData = { /* your post data here */ };

    service.post(endpoint, postData).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${endpoint}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(mockData);
  });

  it('should make a PUT request', () => {
    const mockData = { /* your mock data here */ };
    const endpoint = 'example';
    const putData = { /* your put data here */ };

    service.put(endpoint, putData).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${endpoint}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(putData);
    req.flush(mockData);
  });

  it('should make a DELETE request', () => {
    const mockData = { /* your mock data here */ };
    const endpoint = 'example';

    service.delete(endpoint).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/${endpoint}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockData);
  });
});
