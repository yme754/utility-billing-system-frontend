import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}
  getProfile(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/consumers/profile/${userId}`, {
        headers: this.getHeaders()
    });
  }
  getMyConnections(consumerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consumers/${consumerId}/connections`, {
        headers: this.getHeaders()
    });
  }
  getBillsByConnection(connectionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bills/my-bills/${connectionId}`, {
        headers: this.getHeaders()
    });
  }

  private getHeaders() {
    const token = this.authService.getToken();
    return { 'Authorization': `Bearer ${token}` };
  }
}