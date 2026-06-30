import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EleveService, Eleve } from '../../../services/eleve.service';
import { ClasseService, Classe } from '../../../services/classe.service';

@Component({
  selector: 'app-eleves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eleves.component.html',
  styleUrls: ['./eleves.component.scss']
})
export class ElevesComponent implements OnInit {
  @ViewChild('eleveModal') eleveModal!: TemplateRef<any>;

  search = '';
  successAlert = '';
  isEditMode = false;
  editId = '';

  formNom = '';
  formPrenom = '';
  formClasse = '';
  formNiveau = '';
  formTelephone = '';
  formEmail = '';
  formStatut = 'Actif';

  eleves: Eleve[] = [];
  classes: Classe[] = [];
  niveaux = ['6ème', '5ème', '4ème', '3ème', '2ème', '1ère', 'Tle'];

  constructor(
    private modalService: NgbModal,
    private service: EleveService,
    private classeService: ClasseService
  ) {}

  ngOnInit() {
    this.loadEleves();
    this.classeService.getAll().subscribe({
      next: data => this.classes = data,
      error: () => {}
    });
  }

  loadEleves() {
    this.service.getAll().subscribe({
      next: data => this.eleves = data,
      error: () => {}
    });
  }

  get actifs(): number { return this.eleves.filter(e => e.statut === 'Actif').length; }

  get inactifs(): number { return this.eleves.filter(e => e.statut !== 'Actif').length; }

  private normaliser(v: string): any {
    if(v)
   // alert(v)
    return v.toLowerCase();//.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  get filteredEleves() {
    const s = this.normaliser(this.search);
    if (!s) return this.eleves;
    return this.eleves.filter(e =>
      this.normaliser(e.nom || '').includes(s) ||
      this.normaliser(e.prenom || '').includes(s) ||
      this.normaliser(e.classe || '').includes(s) ||
      this.normaliser(e.niveau || '').includes(s) ||
      this.normaliser(e.statut || '').includes(s) 
    );
  }

  openAddForm() {
    this.isEditMode = false;
    this.editId = '';
    this.formNom = '';
    this.formPrenom = '';
    this.formClasse = '';
    this.formNiveau = '';
    this.formTelephone = '';
    this.formEmail = '';
    this.formStatut = 'Actif';
    this.modalService.open(this.eleveModal, { centered: true, size: 'md' });
  }

  openEditForm(eleve: Eleve) {
    this.isEditMode = true;
    this.editId = eleve.id || '';
    this.formNom = eleve.nom;
    this.formPrenom = eleve.prenom;
    this.formClasse = eleve.classe;
    this.formNiveau = eleve.niveau;
    this.formTelephone = eleve.telephone;
    this.formEmail = eleve.email;
    this.formStatut = eleve.statut;
    this.modalService.open(this.eleveModal, { centered: true, size: 'md' });
  }

  save() {
    if (!this.formNom || !this.formPrenom || !this.formClasse) return;

    const data: Eleve = {
      nom: this.formNom.trim(),
      prenom: this.formPrenom.trim(),
      classe: this.formClasse,
      niveau: this.formNiveau,
      telephone: this.formTelephone.trim(),
      email: this.formEmail.trim(),
      statut: this.formStatut
    };

    if (this.isEditMode && this.editId) {
      this.service.update(this.editId, data).subscribe({
        next: (updatedEleve) => {
          this.eleves = this.eleves.map((e) =>
            e.id === this.editId ? updatedEleve : e
          );
          this.successAlert = 'Élève modifié avec succès';
        },
        error: () => this.successAlert = 'Erreur lors de la modification'
      });
    } else {
      this.service.create(data).subscribe({
        next: (createdEleve) => {
          this.eleves = [...this.eleves, createdEleve];
          this.successAlert = 'Élève ajouté avec succès';
        },
        error: () => this.successAlert = 'Erreur lors de l\'ajout'
      });
    }

    this.modalService.dismissAll();
    setTimeout(() => this.successAlert = '', 4000);
  }

  delete(id: string) {
    if (!confirm('Voulez-vous vraiment supprimer cet élève ?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.eleves = this.eleves.filter((e) => e.id !== id);
        this.successAlert = 'Élève supprimé';
      },
      error: () => this.successAlert = 'Erreur lors de la suppression'
    });
    setTimeout(() => this.successAlert = '', 4000);
  }
}
