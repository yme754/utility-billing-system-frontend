import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ConsumerService } from '../../../core/services/consumer';
import { AuthService } from '../../../core/services/auth';
import { switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-my-connections',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, FormsModule],
  templateUrl: './my-connections.html',
  styleUrl: './my-connections.css'
})
export class MyConnectionsComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;  
  showSuccessModal = false; 
  connections: any[] = [];
  consumerId = ''; 
  newConnection = {
    utilityType: '',
    tariffCategory: ''
  };

  constructor(
    private consumerService: ConsumerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromStorage();
    if (user && user.userId) {
        this.loadProfileAndConnections(user.userId);
    }
  }

  loadProfileAndConnections(authUserId: string) {
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
        next: (data: any) => {
            this.connections = Array.isArray(data) ? data : [];
        },
        error: (err) => {
            console.error('Error loading connections', err);
        }
    });
  }

  refreshConnections() {
      if(!this.consumerId) return;
      this.consumerService.getMyConnections(this.consumerId).subscribe({
          next: (data: any) => {
              this.connections = Array.isArray(data) ? data : [];
              this.cdr.detectChanges();
          },
          error: (err) => console.error(err)
      });
  }

  onRequestSubmit() {
    if (!this.consumerId) {
         alert('Error: User profile not loaded. Try refreshing.');
         return;
     }
    this.isSubmitting = true;
    const payload = {
      consumerId: this.consumerId,
      utilityType: this.newConnection.utilityType,
      tariffCategory: this.newConnection.tariffCategory
    };
    this.consumerService.requestConnection(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;                        
        const modalEl = document.getElementById('newConnectionModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          if (modalInstance) modalInstance.hide();
        }
        this.showSuccessModal = true;        
        this.cdr.detectChanges();
        this.refreshConnections();
        setTimeout(() => {
            this.showSuccessModal = false;
            this.cdr.detectChanges();
        }, 3000); 
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        alert('Failed to submit application');
        this.cdr.detectChanges();
      }
    });
  }
}