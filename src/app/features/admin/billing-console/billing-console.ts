import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MeterService } from '../../../core/services/meter';
import { ConsumerService } from '../../../core/services/consumer';

@Component({
  selector: 'app-billing-console',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './billing-console.html',
  styleUrls: ['./billing-console.css']
})
export class BillingConsoleComponent {
  searchForm: FormGroup;
  readingForm: FormGroup;
  
  selectedConnection: any = null;
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private meterService: MeterService,
    private consumerService: ConsumerService
  ) {
    this.searchForm = this.fb.group({
      connectionId: ['', Validators.required]
    });
    this.readingForm = this.fb.group({
      reading: ['', [Validators.required, Validators.min(0)]]
    });
  }
  searchConnection() {
    if (this.searchForm.invalid) return;
    this.isLoading = true;
    this.message = '';
    this.selectedConnection = null;
    const connId = this.searchForm.value.connectionId;
    this.consumerService.getConnectionById(connId).subscribe({
      next: (data) => {
        this.selectedConnection = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showError('Connection not found or invalid ID.');
      }
    });
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
        this.showSuccess(`Reading submitted! Bill generation triggered for Meter: ${res.meterId}`);
        this.readingForm.reset();
        this.selectedConnection = null;
        this.searchForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.showError('Failed to submit reading. Ensure Meter ID matches.');
        console.error(err);
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