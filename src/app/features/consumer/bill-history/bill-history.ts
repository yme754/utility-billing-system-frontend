import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerService } from '../../../core/services/consumer';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-bill-history',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './bill-history.html'
})
export class BillHistoryComponent implements OnInit, OnChanges {
  @Input() connectionId!: string;
  bills: any[] = [];
  isLoading = false;

  constructor(private consumerService: ConsumerService) {}

  ngOnInit() {
    if (this.connectionId) {
      this.fetchBills();
    }
  }

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