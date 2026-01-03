import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
  isAdmin = false;
  username = 'User';
  isConsumer = false;
  constructor(private authService: AuthService) {}
ngOnInit(): void {
  this.loadUserInfo();
}
loadUserInfo() {
  const user = this.authService.getUserFromStorage();
  if (user) {
    this.username = user.username;
    this.isAdmin = user.roles?.some((r: string) => 
      ['ROLE_ADMIN', 'ROLE_BILLING_OFFICER', 'ROLE_ACCOUNTS_OFFICER'].includes(r)
    );
    this.isConsumer = user.roles?.includes('ROLE_CONSUMER');
  }
}
  onLogout() {
    this.authService.logout();
  }
}