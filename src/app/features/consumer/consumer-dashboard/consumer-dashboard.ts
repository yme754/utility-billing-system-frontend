import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ConsumerService } from '../../../core/services/consumer';
import { AuthService } from '../../../core/services/auth';
import { finalize, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-consumer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
  templateUrl: './consumer-dashboard.html'
})
export class ConsumerDashboardComponent implements OnInit {
  isLoading = true;
  username = 'User';  
  consumerId = '';   
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
    if (user && user.userId) {
      this.username = user.username;
      this.initializeDashboard(user.userId);
    } else {
      this.authService.logout();
    }
  }

  initializeDashboard(authUserId: string) {
    this.isLoading = true;
    this.consumerService.getProfile(authUserId).pipe(
      switchMap((profile: any) => {
        this.consumerId = profile.id;         
        return this.consumerService.getMyConnections(this.consumerId);
      }),
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (connections) => {
        if (!connections || !Array.isArray(connections)) {
           this.activeConnections = 0;
           return;
        }
        this.activeConnections = connections.length;        
        connections.forEach(conn => {
            if (conn && conn.id) this.fetchBillsForConnection(conn.id);
        });
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.isLoading = false;
      }
    });
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
              const unpaid = bills.filter((b: any) => b.status === 'UNPAID');
              unpaid.forEach((b: any) => {
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