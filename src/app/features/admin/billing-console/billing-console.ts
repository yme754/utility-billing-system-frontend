import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MeterService } from '../../../core/services/meter';
import { ConsumerService } from '../../../core/services/consumer';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-billing-console',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './billing-console.html',
  styleUrls: ['./billing-console.css']
})

export class BillingConsoleComponent implements OnInit {
  readingForm: FormGroup;

  selectedConnection: any = null;

  allActiveConnections: any[] = [];
  paginatedConnections: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;

  message = '';
  isError = false;
  isLoading = false;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private meterService: MeterService,
    private consumerService: ConsumerService,
    private cd: ChangeDetectorRef
  ) {
    this.readingForm = this.fb.group({
      reading: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadActiveConnections();
  }

  loadActiveConnections() {
    this.consumerService.getAllConnections().subscribe({
      next: (data) => {
        this.allActiveConnections = data.filter(
          (c: any) => c.status && c.status.toUpperCase() === 'ACTIVE'
        );
        this.updatePagination();
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.allActiveConnections.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedConnections = this.allActiveConnections.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  openSelectionModal() {
    this.showModal = true;
    this.loadActiveConnections();
  }

  closeModal() {
    this.showModal = false;
  }

  selectConnection(conn: any) {
    this.selectedConnection = conn;
    this.showModal = false;
    this.message = '';
    this.cd.detectChanges();
  }

  submitReading() {
    if (this.readingForm.invalid || !this.selectedConnection) return;

    this.isLoading = true;

    const payload = {
      connectionId: this.selectedConnection.id,
      meterId: this.selectedConnection.meterNumber,
      reading: this.readingForm.value.reading
    };

    this.meterService.submitReading(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showSuccess(`Reading submitted successfully for Meter: ${res.meterId}`);
        this.readingForm.reset();
        this.selectedConnection = null;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.showError('Unauthorized: Please login again.');
        } else {
          this.showError('Failed to submit reading. Ensure Meter ID matches.');
        }
        this.cd.detectChanges();
      }
    });
  }

  private showSuccess(msg: string) {
    this.message = msg;
    this.isError = false;
  }

  private showError(msg: string) {
    this.message = msg;
    this.isError = true;
  }
}
