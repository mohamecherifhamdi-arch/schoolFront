import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoteService, Note } from '../../../services/note.service';
import { EleveService, Eleve } from '../../../services/eleve.service';
import { MatiereService, Matiere } from '../../../services/matiere.service';
import { ClasseService, Classe } from '../../../services/classe.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit {
  @ViewChild('noteModal') noteModal!: TemplateRef<any>;

  searchTerm = '';
  selectedEleve = '';
  selectedMatiere = '';
  selectedClasse = '';
  successMessage = '';
  isEditMode = false;
  editId = '';

  formEleve: Eleve | null = null;
  formMatiere = '';
  formClasse: Classe | null = null;
  formType = 'Examen';
  formValeur: number | null = null;
  formCoefficient: number | null = null;
  formDate = '';
  formStatut = 'Publiée';

  notes: Note[] = [];
  eleveList: Eleve[] = [];
  matiereList: Matiere[] = [];
  classeList: Classe[] = [];

  types = ['Examen', 'Devoir', 'TP', 'Projet'];
  statuts = ['Publiée', 'En attente', 'Annulée'];

  constructor(
    private modalService: NgbModal,
    private service: NoteService,
    private eleveService: EleveService,
    private matiereService: MatiereService
    , private classeService: ClasseService
  ) {}

  ngOnInit() {
    this.load();
    this.eleveService.getAll().subscribe({
      next: data => this.eleveList = data,
      error: () => {}
    });
    this.matiereService.getAll().subscribe({
      next: data => this.matiereList = data,
      error: () => {}
    });
    this.classeService.getAll().subscribe({
      next: data => this.classeList = data,
      error: () => {}
    });
  }

  load() {
    this.service.getAll().subscribe({
      next: data => { this.notes = data; },
      error: () => {}
    });
  }

  get elevesIdentity(): string[] {
    return this.eleveList.map(e => `${e.prenom} ${e.nom} (${e.email})`).sort();
  }

  get matieres(): string[] {
    return this.matiereList.map(m => m.nom).sort();
  }

  get classes(): string[] {
    return this.classeList.map(c => c.nom).sort();
  }

  get filteredNotes(): Note[] {
    const s = this.searchTerm.trim().toLowerCase();
    return this.notes.filter(n => {
      const name = n.eleve && typeof n.eleve === 'object' ? `${(n.eleve as any).prenom} ${(n.eleve as any).nom} (${(n.eleve as any).email})` : String(n.eleve || '');
      const classeName = n.classe && typeof n.classe === 'object' ? String((n.classe as any).nom) : String(n.classe || '');
      const matiereName = n.matiere && typeof n.matiere === 'object' ? String((n.matiere as any).nom) : String(n.matiere || '');
      if (s && !name.toLowerCase().includes(s) && !matiereName.toLowerCase().includes(s) && !classeName.toLowerCase().includes(s)) return false;
      if (this.selectedEleve && name !== this.selectedEleve) return false;
      if (this.selectedMatiere && n.matiere?.code !== this.selectedMatiere) return false;
      if (this.selectedClasse && classeName !== this.selectedClasse) return false;
      return true;
    });
  }

  get moyenne(): string {
    if (this.notes.length === 0) return '0';
    const sum = this.notes.reduce((s, n) => s + n.valeur, 0);
    return (sum / this.notes.length).toFixed(1);
  }

  getInitials(name: any): string {
    const str = typeof name === 'object' ? `${name.prenom} ${name.nom}` : (name || '');
    if (!str || !str.trim()) return '?';
    const parts = str.trim().split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  eleveName(e: any): string {
    if (!e) return '';
    return typeof e === 'object' ? `${e.prenom} ${e.nom}` : e;
  }

  classeName(c: any): string {
    if (!c) return '';
    return typeof c === 'object' ? c.nom : c;
  }

  compareById = (a: any, b: any) => {
    if (!a || !b) return a === b;
    return a.id === b.id;
  }

  openAddForm() {
    this.isEditMode = false;
    this.editId = '';
    this.formEleve = null;
    this.formMatiere = '';
    this.formClasse = null;
    this.formType = 'Examen';
    this.formValeur = null;
    this.formCoefficient = 1;
    this.formDate = new Date().toISOString().split('T')[0];
    this.formStatut = 'Publiée';
    this.modalService.open(this.noteModal, { centered: true, size: 'md' });
  }

  openEditForm(n: Note) {
    this.isEditMode = true;
    this.editId = n.id || '';
    this.formEleve = typeof n.eleve === 'object' ? n.eleve as Eleve : (this.eleveList.find(e => `${e.prenom} ${e.nom} (${e.email})` === (n.eleve as string)) || null);
    this.formMatiere = n.matiere && typeof n.matiere === 'object' ? String((n.matiere as any).nom) : String(n.matiere || '');
    this.formClasse = typeof n.classe === 'object' ? n.classe as Classe : (this.classeList.find(c => c.nom === (n.classe as string)) || null);
    this.formType = n.type || 'Examen';
    this.formValeur = n.valeur ?? null;
    this.formCoefficient = n.coefficient ?? 1;
    this.formDate = n.date || new Date().toISOString().split('T')[0];
    this.formStatut = n.statut || 'Publiée';
    this.modalService.open(this.noteModal, { centered: true, size: 'md' });
  }

  save() {
    if (!this.formEleve || !this.formMatiere || this.formValeur === null) return;
    const elevePayload = typeof this.formEleve === 'object' ? this.formEleve : (this.eleveList.find(e => `${e.prenom} ${e.nom} (${e.email})` === (this.formEleve as any)) || null);
    const classePayload = typeof this.formClasse === 'object' ? this.formClasse : (this.classeList.find(c => c.nom === (this.formClasse as any)) || null);

    // Build a minimal DTO matching backend NoteDTO: nested objects should contain only ids
    const matiereObj = this.matiereList.find(m => m.nom === this.formMatiere) || null;

    // Send full objects as requested (eleve, matiere, classe) — backend NoteDTO accepts nested objects
    const dtoPayload: any = {
      eleve: elevePayload ? elevePayload : null,
      matiere: matiereObj ? matiereObj : null,
      classe: classePayload ? classePayload : null,
      type: this.formType,
      valeur: this.formValeur,
      coefficient: this.formCoefficient ?? 1,
      date: this.formDate,
      statut: this.formStatut
    };

    const currentEditId = this.editId;
    if (this.isEditMode && currentEditId) {
      this.service.update(currentEditId, dtoPayload).subscribe({
        next: (updated) => {
          this.notes = this.notes.map((n) =>
            n.id === currentEditId ? updated : n
          );
          this.successMessage = 'Note modifiée avec succès';
        },
        error: () => this.successMessage = 'Erreur lors de la modification'
      });
    } else {
      this.service.create(dtoPayload).subscribe({
        next: (created) => {
          this.notes = [...this.notes, created];
          this.successMessage = 'Note ajoutée avec succès';
        },
        error: () => this.successMessage = 'Erreur lors de l\'ajout'
      });
    }

    this.modalService.dismissAll();
    setTimeout(() => this.successMessage = '', 4000);
  }

  delete(id: string) {
    if (!confirm('Supprimer cette note ?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.notes = this.notes.filter((n) => n.id !== id);
        this.successMessage = 'Note supprimée';
      },
      error: () => this.successMessage = 'Erreur lors de la suppression'
    });
    setTimeout(() => this.successMessage = '', 4000);
  }

  noteColor(v: number): string {
    if (v >= 14) return 'text-success fw-bold';
    if (v >= 10) return 'text-warning fw-bold';
    return 'text-danger fw-bold';
  }
}
