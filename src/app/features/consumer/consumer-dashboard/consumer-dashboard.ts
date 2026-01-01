import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ConsumerService } from '../../../core/services/consumer';
import { AuthService } from '../../../core/services/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './consumer-dashboard.html'
})
export class ConsumerDashboardComponent implements OnInit {
  isLoading = true;
  username = 'User';  
  consumerId = '69534e8abc30316ea6aaeb6f';   
  totalDue = 0;
  activeConnections = 0;
  pendingBillsCount = 0;
  recentBills: any[] = [];

  constructor(
    private consumerService: ConsumerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromStorage();
    if (user) {
        this.username = user.username;
    }
    setTimeout(() => {
        this.loadDashboardData();
    }, 100);
  }

  loadDashboardData() {
    this.consumerService.getMyConnections(this.consumerId)
      .pipe(
        finalize(() => { 
            this.isLoading = false; 
            this.cdr.detectChanges();
        }) 
      )
      .subscribe({
        next: (connections) => {
          if (!connections || !Array.isArray(connections)) {
              this.activeConnections = 0;
              return;
          }
          this.activeConnections = connections.length;          
          connections.forEach(conn => {
              if (conn && conn.id) {
                  this.fetchBillsForConnection(conn.id);
              }
          });
        },
        error: (err) => {
          console.error('Error fetching connections:', err);
        }
      });
  }

  fetchBillsForConnection(connectionId: string) {
      this.consumerService.getBillsByConnection(connectionId).subscribe({
          next: (bills) => {
              if (!bills) return;
              const unpaid = bills.filter(b => b.status === 'UNPAID');
              unpaid.forEach(b => {
                  this.totalDue += (b.totalAmount || 0);
              });
              this.pendingBillsCount += unpaid.length;              
              this.recentBills = [...this.recentBills, ...bills].slice(0, 5);
              this.cdr.detectChanges();
          },
          error: (e) => console.error(e)
      });
  }
}