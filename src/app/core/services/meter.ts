import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class MeterService {
  private apiUrl = 'http://localhost:8080/readings';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  private getHeaders() {
    const token = this.authService.getToken();
    return { 'Authorization': `Bearer ${token}` };
  }
  submitReading(readingData: any): Observable<any> {
    return this.http.post(this.apiUrl, readingData, { headers: this.getHeaders() });
  }
  getReadingHistory(meterId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${meterId}`, { headers: this.getHeaders() });
  }
}