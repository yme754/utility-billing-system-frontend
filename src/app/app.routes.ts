import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ConsumerDashboardComponent } from './features/consumer/consumer-dashboard/consumer-dashboard';
import { AuthGuard } from './core/guards/auth-guard';
import { MyConnectionsComponent } from './features/consumer/my-connections/my-connections';
import { ConnectionSuccessComponent } from './features/consumer/connection-success/connection-success';
import { ConnectionApprovalsComponent } from './features/admin/connection-approvals/connection-approvals';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { BillingConsoleComponent } from './features/admin/billing-console/billing-console';
import { BillHistoryComponent } from './features/consumer/bill-history/bill-history';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },    
  { path: 'consumer/dashboard', component: ConsumerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'consumer/connections', component: MyConnectionsComponent, canActivate: [AuthGuard] },
  { path: 'consumer/connection-success', component: ConnectionSuccessComponent, canActivate: [AuthGuard] },
  { path: 'consumer/bills', component: BillHistoryComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/manage-users', component: ManageUsersComponent, canActivate: [AuthGuard] },
  { path: 'admin/approvals', component: ConnectionApprovalsComponent, canActivate: [AuthGuard] },
  { 
    path: 'admin/billing-console', 
    loadComponent: () => import('./features/admin/billing-console/billing-console')
      .then(m => m.BillingConsoleComponent) 
  }
];