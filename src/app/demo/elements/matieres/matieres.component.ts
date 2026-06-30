import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatiereService, Matiere } from '../../../services/matiere.service';
import { EnseignantService, Enseignant } from '../../../services/enseignant.service';

@Component({
  selector: 'app-matieres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matieres.component.html',
  styleUrls: ['./matieres.component.scss']
})
export class MatieresComponent implements OnInit {
  @ViewChild('matiereModal') matiereModal!: TemplateRef<any>;

  searchTerm = '';
  selectedNiveau = '';
  selectedEnseignant = '';
  successMessage = '';
  isEditMode = false;
  editId = '';

  formCode = '';
  formNom = '';
  formNiveau = '';
  formEnseignantId :string|null = null;
  formCoefficient: number | null = null;
  formCredit: number | null = null;
  formHeures: number | null = null;
  formStatut = 'Actif';

  matieres: Matiere[] = [];
  niveaux = ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année'];
  enseignantList: Enseignant[] = [];
  private _extraEnseignant = '';

  get enseignants(): string[] {
    const names = this.enseignantList.map(e => `${e.prenom} ${e.nom}`).sort();
    if (this._extraEnseignant && !names.includes(this._extraEnseignant)) {
      names.unshift(this._extraEnseignant);
    }
    return names;
  }

  constructor(
    private modalService: NgbModal,
    private service: MatiereService,
    private enseignantService: EnseignantService
  ) {}

  ngOnInit() {
    this.load();
    this.enseignantService.getAll().subscribe({
      next: data => this.enseignantList = data,
      error: () => {}
    });
  }

  load() {
    this.service.getAll().subscribe({
      next: data => this.matieres = data,
      error: () => {}
    });
  }

  get countTotal(): number { return this.matieres.length; }
  get countActif(): number { return this.matieres.filter(m => m.statut === 'Actif').length; }
  get countInactif(): number { return this.matieres.filter(m => m.statut !== 'Actif').length; }
  get totalHeures(): number { return this.matieres.reduce((s, m) => s + (m.heures || 0), 0); }

  get filteredMatieres(): Matiere[] {
    const s = this.searchTerm.trim().toLowerCase();
    return this.matieres.filter(m => {
      if (s && !m.nom?.toLowerCase().includes(s) && !m.code?.toLowerCase().includes(s) && !m.enseignant?.toLowerCase().includes(s)) return false;
      if (this.selectedNiveau && m.niveau !== this.selectedNiveau) return false;
      if (this.selectedEnseignant && m.enseignant !== this.selectedEnseignant) return false;
      return true;
    });
  }

  getInitials(name: string): string {
    if (!name || !name.trim()) return '?';
    const parts = name.trim().split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  openAddForm() {
    this.isEditMode = false;
    this.editId = '';
    this.formCode = '';
    this.formNom = '';
    this.formNiveau = '';
    this.formEnseignantId = null;
    this.formCoefficient = 1;
    this.formCredit = 1;
    this.formHeures = 30;
    this.formStatut = 'Actif';
    this._extraEnseignant = '';
    this.modalService.open(this.matiereModal, { centered: true, size: 'md' });
  }

  openEditForm(m: Matiere) {
    this.isEditMode = true;
    this.editId = m.id || '';
    this.formCode = m.code || '';
    this.formNom = m.nom || '';
    this.formNiveau = m.niveau || '';
    this._extraEnseignant = m.enseignant || '';
    const found = this.enseignantList.find(e => `${e.prenom} ${e.nom}` === this._extraEnseignant);
    this.formEnseignantId = found ? found.id : null;  //todo fix that
    this.formCoefficient = m.coefficient || 1;
    this.formCredit = m.credit || 1;
    this.formHeures = m.heures || 30;
    this.formStatut = m.statut || 'Actif';
    this.modalService.open(this.matiereModal, { centered: true, size: 'md' });
  }

  save() {
    if (!this.formCode || !this.formNom || !this.formNiveau) return;
    console.log("ENSSSS//"+typeof(this.enseignantList[0].id)+"//////"+typeof( this.formEnseignantId)+""+""+"////"+this.enseignantList.find(e => e.id == this.formEnseignantId));
    const data: Matiere = {
      code: this.formCode.trim(),
      nom: this.formNom.trim(),
      niveau: this.formNiveau,
      enseignant: this.enseignantList.find(e => e.id == this.formEnseignantId) || null,
      coefficient: this.formCoefficient ?? 1,
      credit: this.formCredit ?? 1,
      heures: this.formHeures ?? 30,
      statut: this.formStatut
    };

    if (this.isEditMode && this.editId) {
      this.service.update(this.editId, data).subscribe({
        next: () => {
          this.successMessage = 'Matière modifiée avec succès';
          this.load();
        },
        error: () => this.successMessage = 'Erreur lors de la modification'
      });
    } else {
      this.service.create(data).subscribe({
        next: () => {
          this.successMessage = 'Matière ajoutée avec succès';
          this.load();
        },
        error: () => this.successMessage = 'Erreur lors de l\'ajout'
      });
    }

    this.modalService.dismissAll();
    setTimeout(() => this.successMessage = '', 4000);
  }

  delete(id: string) {
    if (!confirm('Supprimer cette matière ?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Matière supprimée';
        this.load();
      },
      error: () => this.successMessage = 'Erreur lors de la suppression'
    });
    setTimeout(() => this.successMessage = '', 4000);
  }
}