import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsumerService } from '../../../core/services/consumer';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { finalize } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-connection-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './connection-approvals.html',
  styleUrls: ['./connection-approvals.css']
})
export class ConnectionApprovalsComponent implements OnInit {
  isLoading = true;
  requests: any[] = [];  
  selectedRequest: any = null;
  meterNumber: string = '';
  isProcessing = false;
  constructor(
    private consumerService: ConsumerService, 
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadPendingRequests();
  }
  loadPendingRequests() {
    this.isLoading = true;
    this.consumerService.getPendingConnections()
    .pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (data) => {
        this.requests = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error fetching requests', err);
      }
    });
  }

  openApproveModal(request: any) {
    this.selectedRequest = request;
    this.meterNumber = '';
    this.cdr.detectChanges();
    const modal = new bootstrap.Modal(document.getElementById('approveModal'));
    modal.show();
  }

  confirmApproval() {
    if (!this.meterNumber) return;
    this.isProcessing = true;
    this.consumerService.approveConnection(this.selectedRequest.id, this.meterNumber).subscribe({
      next: () => {
        this.isProcessing = false;        
        const modalEl = document.getElementById('approveModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        this.loadPendingRequests();
        this.cdr.detectChanges();
        alert('Connection Approved & Activated!');
      },
      error: (err) => {
        console.error(err);
        this.isProcessing = false;
        this.cdr.detectChanges();
        alert('Failed to approve connection.');
      }
    });
  }
}