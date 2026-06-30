import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnseignantService, Enseignant as EnseignantApi } from '../../../services/enseignant.service';

declare const bootstrap: any;

interface Teacher {
  id?: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  experience: string;
  classes: string;
  schedule: string;
  bio: string;
  avatar: string;
}

@Component({
  selector: 'app-element-color',
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './element-color.component.html',
  styleUrls: ['./element-color.component.scss']
})
export default class ElementColorComponent implements OnInit {
  @ViewChild('teacherFormModal') teacherFormModal!: TemplateRef<any>;

  selectedTeacher: Teacher | null = null;
  isEditMode = false;
  editId: string | null = null;
  successAlert = '';

  formName = ''; formSubject = ''; formEmail = ''; formPhone = ''; formLocation = '';
  formStatus = 'Active'; formExperience = ''; formClasses = ''; formSchedule = ''; formBio = '';

  teachers: Teacher[] = [];

  statuses = ['Active', 'En congé', 'Inactive'];

  constructor(private modalService: NgbModal, private service: EnseignantService) {}

  ngOnInit() {
    this.service.getAll().subscribe({
      next: data => {
        this.teachers = data.map(e => ({
          id: e.id, name: e.nom + ' ' + e.prenom, subject: e.matieres?.[0]?.nom || '',
          email: e.email, phone: e.telephone, location: '',
          status: e.statut === 'Actif' ? 'Active' : e.statut,
          experience: '', classes: '', schedule: '', bio: '',
          avatar: 'https://randomuser.me/api/portraits/' + (Math.random() > 0.5 ? 'women' : 'men') + '/' + Math.floor(Math.random() * 90 + 10) + '.jpg'
        }));
      }
    });
  }

  openAddForm() {
    this.isEditMode = false; this.editId = null;
    this.formName = ''; this.formSubject = ''; this.formEmail = ''; this.formPhone = '';
    this.formLocation = ''; this.formStatus = 'Active'; this.formExperience = '';
    this.formClasses = ''; this.formSchedule = ''; this.formBio = '';
    this.modalService.open(this.teacherFormModal, { centered: true, size: 'lg', windowClass: 'teacher-modal' });
  }

  openEditForm(index: number, teacher: Teacher) {
    this.editId = teacher.id || null;
    this.isEditMode = true;
    this.formName = teacher.name; this.formSubject = teacher.subject; this.formEmail = teacher.email;
    this.formPhone = teacher.phone; this.formLocation = teacher.location; this.formStatus = teacher.status;
    this.formExperience = teacher.experience; this.formClasses = teacher.classes;
    this.formSchedule = teacher.schedule; this.formBio = teacher.bio;
    this.modalService.open(this.teacherFormModal, { centered: true, size: 'lg', windowClass: 'teacher-modal' });
  }

  closeForm() { this.isEditMode = false; this.editId = null; this.modalService.dismissAll(); }

  saveTeacher() {
    if (!this.formName || !this.formSubject || !this.formEmail) return;
    const nameParts = this.formName.trim().split(' ');
    const nom = nameParts[0];
    const prenom = nameParts.slice(1).join(' ') || '';
    const dataApi: Partial<EnseignantApi> = {
      nom, prenom, email: this.formEmail, telephone: this.formPhone,
      matieres: [{ nom: this.formSubject }], statut: this.formStatus === 'Active' ? 'Actif' : this.formStatus
    };
    if (this.isEditMode && this.editId) {
      this.service.update(this.editId, dataApi as EnseignantApi).subscribe({
        next: () => { this.successAlert = 'Enseignant modifié'; this.ngOnInit(); },
        error: () => this.successAlert = 'Erreur modification'
      });
    } else {
      this.service.create(dataApi as EnseignantApi).subscribe({
        next: () => { this.successAlert = 'Enseignant ajouté'; this.ngOnInit(); },
        error: () => this.successAlert = 'Erreur ajout'
      });
    }
    this.closeForm();
    setTimeout(() => this.successAlert = '', 4000);
  }

  deleteTeacher(index: number) {
    const teacher = this.teachers[index];
    if (!teacher.id || !confirm('Supprimer cet enseignant ?')) return;
    this.service.delete(teacher.id).subscribe({
      next: () => { this.successAlert = 'Enseignant supprimé'; this.ngOnInit(); },
      error: () => this.successAlert = 'Erreur suppression'
    });
    setTimeout(() => this.successAlert = '', 4000);
  }

  viewTeacher(teacher: Teacher) {
    this.selectedTeacher = teacher;
    const modalElement = document.getElementById('teacherModal');
    if (modalElement) { const modal = new bootstrap.Modal(modalElement); modal.show(); }
  }

  closeTeacher() { this.selectedTeacher = null; }
}
