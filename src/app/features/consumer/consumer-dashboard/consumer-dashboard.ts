import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ConsumerService } from '../../../core/services/consumer';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './consumer-dashboard.html'
})
export class ConsumerDashboardComponent implements OnInit {
  isLoading = true;
  username = '';
  consumerId = '69552d3386120e3b55e37b4f';
  totalDue = 0;
  activeConnections = 0;
  pendingBillsCount = 0;
  recentBills: any[] = [];

  constructor(
    private consumerService: ConsumerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromStorage();
    if (user) {
      this.username = user.username;
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    this.consumerService.getMyConnections(this.consumerId).subscribe({
      next: (connections) => {
        this.activeConnections = connections.length;        
        connections.forEach(conn => {
            this.fetchBillsForConnection(conn.id);
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load connections', err);
        this.isLoading = false;
      }
    });
  }

  fetchBillsForConnection(connectionId: string) {
      this.consumerService.getBillsByConnection(connectionId).subscribe(bills => {
          const unpaid = bills.filter(b => b.status === 'UNPAID');
          unpaid.forEach(b => {
              this.totalDue += b.totalAmount;
          });
          this.pendingBillsCount += unpaid.length;          
          this.recentBills = [...this.recentBills, ...bills].slice(0, 5); 
      });
  }
}