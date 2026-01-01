import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
    roles: ['consumer']
  };
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register(this.user).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errorMessage = err.error?.message || 'Registration failed. Try again.';
      }
    });
  }
}