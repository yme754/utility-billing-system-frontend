import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ConsumerDashboardComponent } from './features/consumer/consumer-dashboard/consumer-dashboard';
import { AuthGuard } from './core/guards/auth-guard';
import { MyConnectionsComponent } from './features/consumer/my-connections/my-connections';
import { ConnectionSuccessComponent } from './features/consumer/connection-success/connection-success';
import { ConnectionApprovalsComponent } from './features/admin/connection-approvals/connection-approvals';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },  
  { path: 'consumer/dashboard', component: ConsumerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'consumer/connections', component: MyConnectionsComponent, canActivate: [AuthGuard] },
  { path: 'consumer/connection-success', component: ConnectionSuccessComponent, canActivate: [AuthGuard] },
  { path: 'admin/approvals', component: ConnectionApprovalsComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] }
];