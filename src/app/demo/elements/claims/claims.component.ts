import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RapportService, Rapport } from '../../../services/rapport.service';
import { EleveService, Eleve } from '../../../services/eleve.service';
import { EnseignantService, Enseignant } from '../../../services/enseignant.service';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  @ViewChild('detailModal') detailModal!: TemplateRef<any>;
  @ViewChild('formModal') formModal!: TemplateRef<any>;

  successAlert = '';
  isEditMode = false;
  editId = '';
  selectedRapport: Rapport | null = null;
  dragging: Rapport | null = null;

  formTitre = '';
  formEleve: any = null;
  formJurys: string[] = [];
  formRemarque = '';
  formDate = '';
  formStatut = 'Non';
  formBibliotheque = false;

  statuts = ['Non', 'Validé'];
  rapports: Rapport[] = [];
  eleves: Eleve[] = [];
  enseignants: Enseignant[] = [];

  constructor(
    private modalService: NgbModal,
    private service: RapportService,
    private eleveService: EleveService,
    private enseignantService: EnseignantService
  ) {}

  ngOnInit() {
    this.load();
    this.eleveService.getAll().subscribe({
      next: data => this.eleves = data,
      error: () => {}
    });
    this.enseignantService.getAll().subscribe({
      next: data => this.enseignants = data,
      error: () => {}
    });
  }

  load() {
    this.service.getAll().subscribe({
      next: data => this.rapports = data,
      error: () => {}
    });
  }

  get non(): Rapport[] { return this.rapports.filter(r => r.statut === 'Non' || r.statut !== 'Validé'); }
  get valides(): Rapport[] { return this.rapports.filter(r => r.statut === 'Validé'); }

  eleveName(r: Rapport): string {
    return r.eleve ? `${r.eleve.prenom} ${r.eleve.nom}` : '—';
  }

  jurysList(r: Rapport): string {
    return r.jurys?.map(j => this.juryName(j)).filter(Boolean).join(', ') || '—';
  }

  statutClass(statut: string): string {
    return statut === 'Validé' ? 'badge-valide' : 'badge-non';
  }

  onDragStart(r: Rapport) { this.dragging = r; }
  onDragOver(e: DragEvent) { e.preventDefault(); }

  onDrop(statut: string) {
    if (!this.dragging || !this.dragging.id) return;
    const currentId = this.dragging.id;
    const updatedRapport = { ...this.dragging, statut } as Rapport;
    this.service.update(currentId, updatedRapport).subscribe({
      next: (updated) => {
        this.rapports = this.rapports.map((r) =>
          r.id === currentId ? updated : r
        );
        this.successAlert = `Rapport ${statut.toLowerCase()}`;
      },
      error: () => {}
    });
    this.dragging = null;
    setTimeout(() => this.successAlert = '', 3000);
  }

  juryName(id: string): string {
    const normalizedId = `${id}`;
    const e = this.enseignants.find(en => `${en.id}` === normalizedId);
    return e ? `${e.prenom} ${e.nom}` : id;
  }

  addJury(id: string) {
    const normalizedId = `${id}`;
    if (normalizedId && !this.formJurys.includes(normalizedId)) {
      this.formJurys.push(normalizedId);
    }
  }

  removeJury(i: number) { this.formJurys.splice(i, 1); }

  openAddForm() {
    this.isEditMode = false;
    this.editId = '';
    this.formTitre = '';
    this.formEleve = null;
    this.formJurys = [];
    this.formRemarque = '';
    this.formDate = new Date().toISOString().slice(0, 10);
    this.formStatut = 'Non';
    this.formBibliotheque = false;
    this.modalService.open(this.formModal, { centered: true, size: 'lg' });
  }

  openEditForm(r: Rapport) {
    this.isEditMode = true;
    this.editId = r.id || '';
    this.formTitre = r.titre;
    this.formEleve = r.eleve || null;
    this.formJurys = (r.jurys || []).map((j: any) => `${j}`);
    this.formRemarque = r.remarque || '';
    this.formDate = r.date;
    this.formStatut = r.statut;
    this.formBibliotheque = r.bibliotheque || false;
    this.modalService.open(this.formModal, { centered: true, size: 'lg' });
  }

  onEleveChange() {
    const e = this.eleves.find(el => el.id === this.formEleve?.id);
    if (e) this.formEleve = e;
  }

  openDetail(r: Rapport) {
    this.selectedRapport = r;
    this.modalService.open(this.detailModal, { centered: true, size: 'md' });
  }

  save() {
    if (!this.formTitre) return;

    const data: Rapport = {
      titre: this.formTitre.trim(),
      eleve: this.formEleve ? { id: this.formEleve.id } : undefined,
      jurys: this.formJurys,
      remarque: this.formRemarque.trim(),
      date: this.formDate,
      statut: this.formStatut,
      bibliotheque: this.formBibliotheque
    };

    const currentEditId = this.editId;
    if (this.isEditMode && currentEditId) {
      this.service.update(currentEditId, data).subscribe({
        next: (updated) => {
          this.rapports = this.rapports.map((r) =>
            r.id === currentEditId ? updated : r
          );
          this.successAlert = 'Rapport modifié';
        },
        error: () => this.successAlert = 'Erreur modification'
      });
    } else {
      this.service.create(data).subscribe({
        next: (created) => {
          this.rapports = [...this.rapports, created];
          this.successAlert = 'Rapport ajouté';
        },
        error: () => this.successAlert = 'Erreur ajout'
      });
    }

    this.modalService.dismissAll();
    setTimeout(() => this.successAlert = '', 3000);
  }

  delete(id: string) {
    if (!confirm('Supprimer ce rapport ?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.rapports = this.rapports.filter((r) => r.id !== id);
        this.successAlert = 'Rapport supprimé';
      },
      error: () => this.successAlert = 'Erreur suppression'
    });
    setTimeout(() => this.successAlert = '', 3000);
  }

  compareEleve(a: any, b: any): boolean { return a && b ? a.id === b.id : a === b; }

  changeStatut(r: Rapport, statut: string) {
    if (!r.id || r.statut === statut) return;
    const data = { ...r, statut };
    this.service.update(r.id, data as Rapport).subscribe({
      next: (updated) => {
        this.rapports = this.rapports.map((item) =>
          item.id === updated.id ? updated : item
        );
        this.successAlert = `Rapport ${statut.toLowerCase()}`;
      },
      error: () => {}
    });
    setTimeout(() => this.successAlert = '', 3000);
  }
}
