import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerService } from '../../../core/services/consumer';

@Component({
  selector: 'app-bill-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill-history.html'
})
export class BillHistoryComponent implements OnChanges {
  @Input() connectionId!: string;
  bills: any[] = [];
  isLoading = false;
  constructor(private consumerService: ConsumerService) {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['connectionId'] && this.connectionId) {
      this.fetchBills();
    }
  }
  fetchBills() {
    this.isLoading = true;
    this.bills = [];
    this.consumerService.getBillsByConnection(this.connectionId).subscribe({
      next: (data) => {
        this.bills = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}