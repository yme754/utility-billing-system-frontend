import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ConsumerService } from '../../../core/services/consumer';
import { BillingService } from '../../../core/services/billing';
import { forkJoin } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, BaseChartDirective],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  stats = [
    { title: 'Total Consumers', value: '0', icon: 'bi-people', color: 'primary' },
    { title: 'Pending Connections', value: '0', icon: 'bi-hourglass-split', color: 'warning' },
    { title: 'Active Connections', value: '0', icon: 'bi-lightning-charge', color: 'success' },
    { title: 'Total Revenue', value: '₹0', icon: 'bi-currency-rupee', color: 'info' },
  ];

  isLoading = true;
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [], 
    datasets: [{ data: [], label: 'Monthly Revenue (₹)', backgroundColor: '#0d6efd' }]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  public doughnutChartLabels: string[] = ['Paid', 'Unpaid'];
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [], backgroundColor: ['#198754', '#ffc107'] }]
  };
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  constructor(
    private consumerService: ConsumerService,
    private billingService: BillingService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    forkJoin({
      adminStats: this.billingService.getAdminStats(),
      allConnections: this.consumerService.getAllConnections(),
      allBills: this.billingService.getAllBills()
    }).subscribe({
      next: ({ adminStats, allConnections, allBills }) => {        
        const totalConsumers = adminStats.totalConsumers || 0;
        const pendingCount = allConnections.filter((c: any) => c.status === 'PENDING' || c.active === false).length;
        const activeCount = allConnections.filter((c: any) => c.status === 'ACTIVE' || c.active === true).length;
        const revenue = adminStats.totalRevenue || 0;
        this.stats = [
          { title: 'Total Consumers', value: totalConsumers.toString(), icon: 'bi-people', color: 'primary' },
          { title: 'Pending Connections', value: pendingCount.toString(), icon: 'bi-hourglass-split', color: 'warning' },
          { title: 'Active Connections', value: activeCount.toLocaleString(), icon: 'bi-lightning-charge', color: 'success' },
          { title: 'Total Revenue', value: '₹' + revenue.toLocaleString('en-IN'), icon: 'bi-currency-rupee', color: 'info' },
        ];
        this.processChartData(allBills);
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.isLoading = false;
      }
    });
  }

  processChartData(bills: any[]) {
    const paidCount = bills.filter(b => b.status === 'PAID').length;
    const unpaidCount = bills.filter(b => b.status === 'UNPAID').length;
    this.doughnutChartData = {
      labels: ['Paid Bills', 'Pending Bills'],
      datasets: [{ 
        data: [paidCount, unpaidCount], 
        backgroundColor: ['#198754', '#ffc107'],
        hoverBackgroundColor: ['#157347', '#ffca2c']
      }]
    };
    const revenueMap = new Map<string, number>();
    
    bills.forEach(bill => {
      const date = new Date(bill.billingDate);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const currentSum = revenueMap.get(monthYear) || 0;
      revenueMap.set(monthYear, currentSum + (bill.totalAmount || 0));
    });
    const labels = Array.from(revenueMap.keys());
    const data = Array.from(revenueMap.values());
    this.barChartData = {
      labels: labels,
      datasets: [{ 
        data: data, 
        label: 'Revenue (₹)', 
        backgroundColor: '#0d6efd',
        borderRadius: 5
      }]
    };
  }
}