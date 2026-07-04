import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { EnseignantService, Enseignant } from '../../../services/enseignant.service';
import { MatiereService, Matiere } from '../../../services/matiere.service';

@Component({
  selector: 'app-enseignants',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTooltip],
  templateUrl: './enseignants.component.html',
  styleUrls: ['./enseignants.component.scss']
})
export class EnseignantsComponent implements OnInit {
  @ViewChild('enseignantModal') enseignantModal!: TemplateRef<any>;

  search = '';
  filterStatut = '';
  filterMatiere = '';
  successAlert = '';
  isEditMode = false;
  editId = '';

  formNom = '';
  formPrenom = '';
  formEmail = '';
  formTelephone = '';
  formMatieres: any[] = [];
  formStatut = 'Actif';

  enseignants: Enseignant[] = [];
  matieres: Matiere[] = [];

  constructor(
    private modalService: NgbModal,
    private service: EnseignantService,
    private matiereService: MatiereService
  ) {}

  ngOnInit() {
    this.load();
    this.matiereService.getAll().subscribe({
      next: data => this.matieres = data,
      error: () => {}
    });
  }

  load() {
    this.service.getAll().subscribe({
      next: data => this.enseignants = data,
      error: () => {}
    });
  }

  get actifs(): number { return this.enseignants.filter(e => e.statut === 'Actif').length; }

  get inactifs(): number { return this.enseignants.filter(e => e.statut !== 'Actif').length; }

  get filtered() {
    const s = this.search.trim().toLowerCase();
    return this.enseignants.filter(e => {
      if (s && !e.nom.toLowerCase().includes(s) && !e.prenom.toLowerCase().includes(s) && !e.matieres?.some(m => m.nom?.toLowerCase().includes(s))) return false;
      if (this.filterStatut && e.statut !== this.filterStatut) return false;
      if (this.filterMatiere && !e.matieres?.some(m => m.nom === this.filterMatiere)) return false;
      return true;
    });
  }

  openAddForm() {
    this.isEditMode = false;
    this.editId = '';
    this.formNom = '';
    this.formPrenom = '';
    this.formEmail = '';
    this.formTelephone = '';
    this.formMatieres = [];
    this.formStatut = 'Actif';
    this.modalService.open(this.enseignantModal, { centered: true, size: 'md' });
  }

  openEditForm(e: Enseignant) {
    this.isEditMode = true;
    this.editId = e.id || '';
    this.formNom = e.nom;
    this.formPrenom = e.prenom;
    this.formEmail = e.email;
    this.formTelephone = e.telephone;
    this.formMatieres = e.matieres || [];
    this.formStatut = e.statut;
    this.modalService.open(this.enseignantModal, { centered: true, size: 'md' });
  }

  toggleMatiere(m: any) {
    const idx = this.formMatieres.findIndex(fm => fm.id === m.id);
    if (idx >= 0) {
      this.formMatieres.splice(idx, 1);
    } else {
      this.formMatieres.push(m);
    }
  }

  isMatiereSelected(m: any): boolean {
    return this.formMatieres.some(fm => fm.id === m.id);
  }

  save() {
    if (!this.formNom || !this.formPrenom) return;

    const data: Enseignant = {
      nom: this.formNom.trim(),
      prenom: this.formPrenom.trim(),
      email: this.formEmail.trim(),
      telephone: this.formTelephone.trim(),
      matieres: this.formMatieres,
      statut: this.formStatut
    };

    if (this.isEditMode && this.editId) {
      this.service.update(this.editId, data).subscribe({
        next: (updated) => {
          this.enseignants = this.enseignants.map((e) =>
            e.id === this.editId ? updated : e
          );
          this.successAlert = 'Enseignant modifié avec succès';
        },
        error: () => this.successAlert = 'Erreur modification'
      });
    } else {
      this.service.create(data).subscribe({
        next: (created) => {
          this.enseignants = [...this.enseignants, created];
          this.successAlert = 'Enseignant ajouté avec succès';
        },
        error: () => this.successAlert = 'Erreur ajout'
      });
    }

    this.modalService.dismissAll();
    setTimeout(() => this.successAlert = '', 4000);
  }

  getAbsenceCount(e: Enseignant): number {
    console.log("Absences for enseignant", e);
    return Array.isArray(e.absences) ? e.absences.length : 0;
  }

  getAbsencesTooltip(e: Enseignant): string {
    if (!e.absences || e.absences.length === 0) return '';
    return e.absences.map((a: any) =>
      `${a.date} (${a.seance})${a.justifie ? ' ✓ justifiée' : ' ✗ non justifiée'}`
    ).join('\n');
  }

  delete(id: string) {
    if (!confirm('Supprimer cet enseignant ?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.enseignants = this.enseignants.filter((e) => e.id !== id);
        this.successAlert = 'Enseignant supprimé';
      },
      error: () => this.successAlert = 'Erreur suppression'
    });
    setTimeout(() => this.successAlert = '', 4000);
  }
}
