import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReclamationService, Reclamation } from '../../../services/reclamation.service';
import { EnseignantService, Enseignant } from '../../../services/enseignant.service';
import { EleveService, Eleve } from '../../../services/eleve.service';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.scss'
})
export class ReclamationComponent implements OnInit {
  @ViewChild('reclamationModal') reclamationModal!: TemplateRef<any>;

  searchTerm = '';
  selectedStatut = '';
  successMessage = '';
  isEditMode = false;
  editId = '';

  formEnseignant: any = null;
  formEleve: any = null;
  formDate = '';
  formCause = '';
  formPenalite = '';
  formStatut = 'Ouvert';

  reclamations: Reclamation[] = [];
  enseignantList: Enseignant[] = [];
  eleveList: Eleve[] = [];

  causes = ['Retard', 'Absence', 'Comportement', 'Devoir non rendu', 'Tricherie', 'Bruit', 'Tenue', 'Autre'];
  penalites = ['Avertissement oral', 'Avertissement écrit', 'Heures de retenue', 'Exclusion temporaire', 'Devoir supplémentaire', 'Convocation parents', 'Autre'];

  constructor(
    private modalService: NgbModal,
    private service: ReclamationService,
    private enseignantService: EnseignantService,
    private eleveService: EleveService
  ) {}

  ngOnInit() {
    this.load();
    this.enseignantService.getAll().subscribe({
      next: data => this.enseignantList = data,
      error: () => {}
    });
    this.eleveService.getAll().subscribe({
      next: data => this.eleveList = data,
      error: () => {}
    });
  }

  load() {
    this.service.getAll().subscribe({
      next: data => { this.reclamations = data; },
      error: () => {}
    });
  }

  enseignantFullName(e: any): string {
    if (!e) return '';
    if (typeof e === 'object') return `${e.prenom || ''} ${e.nom || ''}`.trim();
    return e;
  }

  eleveFullName(e: any): string {
    if (!e) return '';
    if (typeof e === 'object') return `${e.prenom || ''} ${e.nom || ''}`.trim();
    return e;
  }

  compareById(a: any, b: any): boolean {
    return a && b ? a.id === b.id : a === b;
  }

  get filteredReclamations(): Reclamation[] {
    const s = this.searchTerm.trim().toLowerCase();
    return this.reclamations.filter(r => {
      const enseignantName = typeof r.enseignant === 'object' ? `${r.enseignant.prenom} ${r.enseignant.nom}` : (r.enseignant || '');
      const eleveName = typeof r.eleve === 'object' ? `${r.eleve.prenom} ${r.eleve.nom}` : (r.eleve || '');
      if (s && !enseignantName.toLowerCase().includes(s) && !eleveName.toLowerCase().includes(s) && !r.cause?.toLowerCase().includes(s)) return false;
      if (this.selectedStatut && r.statut !== this.selectedStatut) return false;
      return true;
    });
  }

  openAddForm() {
    this.isEditMode = false;
    this.editId = '';
    this.formEnseignant = null;
    this.formEleve = null;
    this.formDate = '';
    this.formCause = '';
    this.formPenalite = '';
    this.formStatut = 'Ouvert';
    this.modalService.open(this.reclamationModal, { centered: true, size: 'md' });
  }

  openEditForm(r: Reclamation) {
    this.isEditMode = true;
    this.editId = r.id || '';
    this.formEnseignant = typeof r.enseignant === 'object' ? r.enseignant : null;
    this.formEleve = typeof r.eleve === 'object' ? r.eleve : null;
    this.formDate = r.date || '';
    this.formCause = r.cause || '';
    this.formPenalite = r.penalite || '';
    this.formStatut = r.statut || 'Ouvert';
    this.modalService.open(this.reclamationModal, { centered: true, size: 'md' });
  }

  save() {
    if (!this.formEnseignant || !this.formEleve) return;

    const data: Reclamation = {
      enseignant: this.formEnseignant,
      eleve: this.formEleve,
      cause: this.formCause,
      penalite: this.formPenalite,
      statut: this.formStatut,
      date: this.formDate || new Date().toISOString().split('T')[0]
    };

    if (this.isEditMode && this.editId) {
      this.service.update(this.editId, data).subscribe({
        next: () => {
          this.successMessage = 'Réclamation modifiée avec succès';
          this.load();
          this.modalService.dismissAll();
        },
        error: () => this.successMessage = 'Erreur lors de la modification'
      });
    } else {
      this.service.create(data).subscribe({
        next: () => {
          this.successMessage = 'Réclamation ajoutée avec succès';
          this.load();
          this.modalService.dismissAll();
        },
        error: () => this.successMessage = 'Erreur lors de l\'ajout'
      });
    }

    setTimeout(() => this.successMessage = '', 4000);
  }

  delete(id: string) {
    if (!confirm('Supprimer cette réclamation ?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Réclamation supprimée';
        this.load();
      },
      error: () => this.successMessage = 'Erreur lors de la suppression'
    });
    setTimeout(() => this.successMessage = '', 4000);
  }

  getInitials(name: string): string {
    if (!name || !name.trim()) return '?';
    const parts = name.trim().split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  getStatutClass(s: string): string {
    const map: Record<string, string> = { Ouvert: 's-ouvert', 'En cours': 's-encours', Résolu: 's-resolu', Fermé: 's-ferme' };
    return map[s] || '';
  }
}
