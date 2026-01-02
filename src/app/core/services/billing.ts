import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private apiUrl = 'http://localhost:8080/bills';
  constructor(private http: HttpClient) {}
  getMyBills(connectionId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-bills/${connectionId}`);
  }
  payBill(billId: string, mode: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${billId}/pay?mode=${mode}`, {});
  }
}