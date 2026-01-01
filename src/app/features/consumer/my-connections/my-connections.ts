import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ConsumerService } from '../../../core/services/consumer';
import { AuthService } from '../../../core/services/auth';
import { switchMap, finalize } from 'rxjs/operators';

declare var bootstrap: any;

@Component({
  selector: 'app-my-connections',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, FormsModule],
  templateUrl: './my-connections.html'
})
export class MyConnectionsComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;
  connections: any[] = [];
  consumerId = ''; 
  newConnection = {
    utilityType: 'ELECTRICITY',
    tariffCategory: 'Residential'
  };
  constructor(
    private consumerService: ConsumerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
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

  loadConnections() {
    this.consumerService.getMyConnections(this.consumerId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          this.connections = Array.isArray(data) ? data : [];
        },
        error: (err) => {
          console.error('Failed to load connections:', err);
        }
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
        this.loadConnections();
        alert('Application Submitted Successfully!');
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