import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { UserManagementService } from '../../../core/services/user-management';
import { User } from '../../../models/user';

type ModalType = 'APPROVE' | 'DENY' | 'STATUS_CHANGE' | 'WARNING';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsersComponent implements OnInit {

  users: User[] = [];
  roles = ['ROLE_ADMIN', 'ROLE_CONSUMER', 'ROLE_BILLINGS_OFFICER', 'ROLE_ACCOUNTS_OFFICER'];
  
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: ModalType = 'WARNING';
  
  pendingUser: User | null = null;
  actionType: 'ACTIVATE' | 'DEACTIVATE' = 'DEACTIVATE';

  constructor(
    private userService: UserManagementService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadUsers();
    }, 100); 
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = [...data.map(u => ({
          ...u,
          role: u.roles?.[0] ?? null,
          tempRole: '' 
        }))];        
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to load users', err);
        this.users = [];
        this.cdr.detectChanges();
      }
    });
  }

  openModal(title: string, message: string, type: ModalType) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;     
    this.cdr.detectChanges();
  }

  onApprove(user: User) {
    if (!user.tempRole) {
      this.openModal(
        'Missing Role',
        'Please assign a role before approving this user.',
        'WARNING'
      );
      return;
    }
    this.pendingUser = user;
    this.openModal(
      'Confirm Approval',
      `Approve ${user.username} as ${user.tempRole.replace('ROLE_', '')}?`,
      'APPROVE'
    );
  }

  onDeny(user: User) {
    this.pendingUser = user;
    this.openModal(
      'Deny User',
      `Are you sure you want to deny ${user.username}?`,
      'DENY'
    );
  }

  initiateStatusChange(user: User, type: 'ACTIVATE' | 'DEACTIVATE') {
    this.pendingUser = user;
    this.actionType = type;
    this.openModal(
      `${type === 'ACTIVATE' ? 'Activate' : 'Deactivate'} User`,
      `Are you sure you want to ${type.toLowerCase()} ${user.username}?`,
      'STATUS_CHANGE'
    );
  }

  handleModalConfirm() {
    if (this.modalType === 'WARNING') {
      this.closeModal();
      return;
    }

    if (!this.pendingUser) return;
    if (this.modalType === 'APPROVE') {
      this.userService.approveUser(this.pendingUser.id, this.pendingUser.tempRole!).subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.id === this.pendingUser?.id);
          if (index !== -1) {
            this.users[index].status = 'ACTIVE';
            this.users[index].role = this.pendingUser!.tempRole ?? null;
            this.users[index].tempRole = ''; 
          }
          this.closeModal();
        },
        error: (err) => {
          console.error('Approval failed', err);
          this.closeModal();
        }
      });
    }     
    else if (this.modalType === 'DENY') {
      this.userService.updateUserStatus(this.pendingUser.id, 'DENIED').subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.id === this.pendingUser?.id);
          if (index !== -1) {
            this.users[index].status = 'DENIED';
          }
          this.closeModal();
        },
        error: (err) => {
          console.error('Deny failed', err);
          this.closeModal();
        }
      });
    }     
    else if (this.modalType === 'STATUS_CHANGE') {
      const newStatus = this.actionType === 'ACTIVATE' ? 'ACTIVE' : 'INACTIVE';
      this.userService.updateUserStatus(this.pendingUser.id, newStatus).subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.id === this.pendingUser?.id);
          if (index !== -1) {
            this.users[index].status = newStatus;
          }
          this.closeModal();
        },
        error: (err) => {
          console.error('Status change failed', err);
          this.closeModal();
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.pendingUser = null;
    this.cdr.detectChanges();
  }

  closeAndRefresh() {
    this.closeModal();
    this.loadUsers();
  }
}