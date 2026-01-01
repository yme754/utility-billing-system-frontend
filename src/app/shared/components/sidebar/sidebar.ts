import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
})
export class SidebarComponent implements OnInit {
  isAdmin = false;
  username = 'User';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromStorage();
    if (user) {
      this.username = user.username;
      this.isAdmin = user.roles && user.roles.includes('ROLE_ADMIN');
    }
  }

  logout() {
    this.authService.logout();
  }
}