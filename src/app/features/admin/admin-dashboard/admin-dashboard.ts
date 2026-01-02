import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent {
  stats = [
    { title: 'Total Consumers', value: '124', icon: 'bi-people', color: 'primary' },
    { title: 'Pending Requests', value: '3', icon: 'bi-hourglass-split', color: 'warning' },
    { title: 'Active Connections', value: '1,092', icon: 'bi-lightning-charge', color: 'success' },
    { title: 'Total Revenue', value: '₹45,200', icon: 'bi-currency-rupee', color: 'info' },
  ];
}
