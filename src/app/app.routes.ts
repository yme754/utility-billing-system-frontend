import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ConsumerDashboardComponent } from './features/consumer/consumer-dashboard/consumer-dashboard';
import { AuthGuard } from './core/guards/auth-guard';
import { MyConnectionsComponent } from './features/consumer/my-connections/my-connections';
import { ConnectionSuccessComponent } from './features/consumer/connection-success/connection-success';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },  
  { path: 'admin/dashboard', component: LoginComponent },
  { path: 'consumer/dashboard', component: ConsumerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'consumer/connections', component: MyConnectionsComponent, canActivate: [AuthGuard] },
  { path: 'consumer/connection-success', component: ConnectionSuccessComponent, canActivate: [AuthGuard] }
];