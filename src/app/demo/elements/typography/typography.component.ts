import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService, Admin } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-typography',
  imports: [CommonModule, FormsModule],
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export default class TypographyComponent implements OnInit {
  @ViewChild('adminModal') adminModal!: TemplateRef<any>;

  isEditMode = false;
  editId: number | null = null;
  loading = false;
  successAlert = '';
  errorAlert = '';

  formName = '';
  formEmail = '';
  formPassword = '';
  formRole = 'Administrateur';
  formStatus = 'Invité';

  roles = ['Super Admin', 'Administrateur', 'Modérateur'];
  statuses = ['Actif', 'Inactif', 'Invité'];

  currentUserRole = '';

  get isSuperAdmin(): boolean {
    return this.currentUserRole === 'SUPER_ADMIN';
  }

  admins: Admin[] = [];

  constructor(
    private modalService: NgbModal,
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const role = this.authService.getRole();
    this.currentUserRole = role ||'';
    this.load();
  }

  private mapRoleToApi(role: string): string {
    if (role === 'Super Admin') return 'SUPER_ADMIN';
    if (role === 'Administrateur') return 'ADMIN';
    return 'USER';
  }

  private mapStatusToApi(status: string): string {
    if (status === 'Actif') return 'ACTIVE';
    if (status === 'Inactif') return 'INACTIVE';
    return 'INVITED';
  }

  load() {
    this.loading = true;
    this.adminService.getAll().subscribe({
      next: data => { this.admins = data; this.loading = false; },
      error: () => { this.errorAlert = 'Erreur de chargement'; this.loading = false; }
    });
  }

  openAddForm() {
    this.isEditMode = false;
    this.editId = null;
    this.formName = '';
    this.formEmail = '';
    this.formPassword = '';
    this.formRole = this.isSuperAdmin ? 'Super Admin' : 'Administrateur';
    this.formStatus = 'Invité';
    this.errorAlert = '';
    this.modalService.open(this.adminModal, { centered: true, size: 'md', windowClass: 'admin-modal' });
  }

  openEditForm(admin: Admin) {
    this.editId = admin.id || null;
    this.isEditMode = true;
    this.formName = admin.name;
    this.formEmail = admin.email;
    this.formPassword = '';
    this.formRole = admin.role;
    this.formStatus = admin.status;
    this.errorAlert = '';
    this.modalService.open(this.adminModal, { centered: true, size: 'md', windowClass: 'admin-modal' });
  }

  closeForm() {
    this.isEditMode = false;
    this.editId = null;
    this.modalService.dismissAll();
  }

  saveAdmin() {
    if (!this.formName || !this.formEmail) return;
    this.errorAlert = '';

    const adminData: Admin = {
      name: this.formName.trim(),
      email: this.formEmail.trim(),
      role: this.formRole,
      status: this.formStatus
    };

    if (this.isEditMode && this.editId) {
      this.adminService.update(this.editId, adminData).subscribe({
        next: () => {
          this.successAlert = 'Administrateur mis à jour avec succès !';
          this.load();
        },
        error: () => this.errorAlert = 'Erreur lors de la mise à jour'
      });
    } else {
      if (!this.formPassword) {
        this.errorAlert = 'Mot de passe requis';
        return;
      }
      this.authService.register({
        username: this.formEmail.trim(),
        password: this.formPassword,
        role: this.mapRoleToApi(this.formRole),
        status: this.mapStatusToApi(this.formStatus)
      }).subscribe({
        next: () => {
          this.successAlert = 'Administrateur ajouté avec succès !';
          this.load();
          this.closeForm();
        },
        error: (err) => {
          this.errorAlert = typeof err.error === 'string' ? err.error : 'Erreur lors de la creation du compte';
        }
      });
    }

    setTimeout(() => { this.successAlert = ''; this.errorAlert = ''; }, 4000);
  }

  deleteAdmin(admin: Admin) {
    if (!admin.id || !confirm('Voulez-vous vraiment supprimer ' + admin.name + ' ?')) return;
    this.adminService.delete(admin.id).subscribe({
      next: () => {
        this.successAlert = 'Administrateur supprimé avec succès !';
        this.load();
      },
      error: () => this.successAlert = 'Erreur lors de la suppression'
    });
    setTimeout(() => this.successAlert = '', 4000);
  }

  resendInvite(admin: Admin) {
    if (!admin.id) return;
    this.adminService.resendInvitation(admin.id).subscribe({
      next: () => {
        this.successAlert = 'Invitation renvoyée à ' + admin.email;
      },
      error: () => this.successAlert = 'Erreur lors du renvoi'
    });
    setTimeout(() => this.successAlert = '', 4000);
  }

  acceptInvite(admin: Admin) {
    if (admin.invitationToken) {
      this.adminService.acceptInvitation(admin.invitationToken).subscribe({
        next: () => {
          this.successAlert = 'Invitation acceptée pour ' + admin.name;
          this.load();
        },
        error: () => this.successAlert = "Erreur lors de l'acceptation"
      });
      setTimeout(() => this.successAlert = '', 4000);
    }
  }

  countByStatus(status: string) {
    return this.admins.filter(a => a.status === status).length;
  }
}
