import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParentService, Parent as ParentApi } from '../../../services/parent.service';
import { EleveService, Eleve } from '../../../services/eleve.service';
import { Parent } from '../../models/Parent';

@Component({
  selector: 'app-parents',
  imports: [CommonModule, FormsModule],
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.scss']
})
export class ParentsComponent implements OnInit {
  @ViewChild('parentModal') parentModal!: TemplateRef<any>;

  search = '';

  isEditMode = false;
  successAlert = '';

  formName = '';
  formAddress = '';
  formEmail = '';
  formEleves: number[] = [];
  formPhone = '';
  eleveSearch = '';
  editParentId = '';

  parents: Parent[] = [];
  eleves: Eleve[] = [];

  constructor(private service: ParentService, private eleveService: EleveService, private modalService: NgbModal) {}

  ngOnInit() {
    this.service.getAll().subscribe({
      next: data => {
        this.parents = data.map(this.mapApiParent);
      }
    });
    this.eleveService.getAll().subscribe({
      next: data => this.eleves = data
    });
  }

  private mapApiParent = (p: ParentApi): Parent => ({
    name: p.nom,
    address: p.adresse,
    id: p.id!,
    email: p.email || '',
    eleves: (p.eleves || []).map((e: any) => `${e.nom} ${e.prenom}`),
    eleveIds: (p.eleves || []).map((e: any) => e.id).filter((id: number) => id),
    phone: p.telephone
  });

  deleteParent(id: string) {
   // if (!confirm('Voulez-vous vraiment supprimer ce parent ?')) return;
    this.service.delete(id).subscribe({ error: () => {} });
    this.parents = this.parents.filter((p) => p.id !== id);
    this.successAlert = 'Parent supprimé !';
    setTimeout(() => this.successAlert = '', 4000);
    if (this.isEditMode && this.editParentId === id) this.closeForm();
  }

  openAddForm() {
    this.isEditMode = false;
    this.formName = ''; this.formAddress = ''; this.formEmail = ''; this.formEleves = []; this.formPhone = '';
    this.editParentId = '';
    this.modalService.open(this.parentModal, { centered: true, size: 'md' });
  }

  openEditForm(parent: Parent) {
    this.editParentId = parent.id;
    this.formName = parent.name; this.formAddress = parent.address;
    this.formEmail = parent.email; this.formEleves = [...parent.eleveIds];
    this.formPhone = parent.phone;
    this.isEditMode = true;
    this.modalService.open(this.parentModal, { centered: true, size: 'md' });
  }

  closeForm() { this.modalService.dismissAll(); this.isEditMode = false; this.editParentId = ''; }

  saveParent() {
    if (!this.formName || !this.formPhone || !this.formAddress || this.formEleves.length === 0) return;
    const apiData: ParentApi = {
      nom: this.formName.trim(), adresse: this.formAddress.trim(), telephone: this.formPhone.trim(),
      email: this.formEmail.trim(), eleves: this.formEleves.map(id => ({ id }))
    };
    const currentEditId = this.editParentId;

    if (this.isEditMode && currentEditId) {
      this.service.update(currentEditId, apiData).subscribe({
        next: (updated) => {
          const mapped = this.mapApiParent(updated);
          this.parents = this.parents.map((p) =>
            p.id === currentEditId ? mapped : p
          );
          this.successAlert = 'Parent modifié !';
        },
        error: () => this.successAlert = 'Erreur modification'
      });
    } else {
      this.service.create(apiData).subscribe({
        next: (created) => {
          this.parents = [...this.parents, this.mapApiParent(created)];
          this.successAlert = 'Parent ajouté !';
        },
        error: () => this.successAlert = 'Erreur ajout'
      });
    }
    this.modalService.dismissAll();
    this.isEditMode = false; this.editParentId = '';
    setTimeout(() => this.successAlert = '', 4000);
  }

  toggleEleve(id: number) {
    alert("selecteeeed")
    const idx = this.formEleves.indexOf(id);
    if (idx >= 0) this.formEleves.splice(idx, 1);
    else this.formEleves.push(id);
  }

  isSelected(id: number): boolean {
    return this.formEleves.includes(id);
  }

  get filteredEleves() {
    const s = (this.eleveSearch || '').toLowerCase()//.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return s
      ? this.eleves.filter(e => {
          const name = `${e.nom} ${e.prenom}`.toLowerCase()//.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return name.includes(s);
        })
      : this.eleves;
  }

  get totalAvecEmail(): number { return this.parents.filter(p => p.email).length; }
  get totalEleves(): number { return this.parents.reduce((sum, p) => sum + p.eleves.length, 0); }
  get totalSansEmail(): number { return this.parents.length - this.totalAvecEmail; }

  get filteredParents() {
    const search = this.search.trim().toLowerCase();
    return search
      ? this.parents.filter((parent) =>
          parent.name.toLowerCase().includes(search) ||
          parent.id.toLowerCase().includes(search) ||
          parent.email.toLowerCase().includes(search) ||
          parent.eleves.some(e => e.toLowerCase().includes(search))
        )
      : this.parents;
  }
}
