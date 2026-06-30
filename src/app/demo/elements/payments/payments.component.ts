import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService, Payment } from '../../../services/payment.service';
import { EleveService, Eleve } from '../../../services/eleve.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit {
  @ViewChild('paymentModal') paymentModal!: TemplateRef<any>;

  searchTerm = '';
  selectedEleve = '';
  selectedMois = '';
  selectedStatut = '';
  successMessage = '';
  isEditMode = false;
  editId = '';

  formEleve: Eleve | null = null;
  formMois = '';
  formMontantAttendu: number | null = null;
  formMontantPaye: number | null = null;
  formDatePaiement = '';
  formTypePaiement = 'Espèces';
  formStatut = 'Payé';
  formRemarque = '';

  payments: Payment[] = [];
  eleveList: Eleve[] = [];

  moisList = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  typesPaiement = ['Espèces', 'Chèque', 'Virement', 'Carte bancaire'];
  statuts = ['Payé', 'En attente', 'Impayé'];

  expandedEleve = '';

  constructor(
    private modalService: NgbModal,
    private service: PaymentService,
    private eleveService: EleveService
  ) {}

  ngOnInit() {
    this.load();
    this.eleveService.getAll().subscribe({
      next: data => this.eleveList = data,
      error: () => {}
    });
  }

  load() {
    this.service.getAll().subscribe({
      next: data => { this.payments = data; },
      error: () => {}
    });
  }

  get eleves(): string[] {
    return this.eleveList.map(e => `${e.prenom} ${e.nom}`).sort();
  }

  get eleveSummaries(): { name: string; totalAttendu: number; totalPaye: number; reste: number; payments: Payment[] }[] {
    const grouped = new Map<string, Payment[]>();
    for (const p of this.payments) {
      const name = typeof p.eleve === 'object' ? `${(p.eleve as any).prenom} ${(p.eleve as any).nom}` : (p.eleve || '');
      if (!grouped.has(name)) grouped.set(name, []);
      grouped.get(name)!.push(p);
    }
    return Array.from(grouped.entries()).map(([name, list]) => ({
      name,
      totalAttendu: list.reduce((s, p) => s + p.montantAttendu, 0),
      totalPaye: list.reduce((s, p) => s + p.montantPaye, 0),
      reste: list.reduce((s, p) => s + p.montantAttendu - p.montantPaye, 0),
      payments: list.sort((a, b) => (b.datePaiement || '').localeCompare(a.datePaiement || ''))
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  compareById = (a: any, b: any) => {
    if (!a || !b) return a === b;
    return a.id === b.id;
  }

  get filteredSummaries() {
    const s = this.searchTerm.trim().toLowerCase();
    return this.eleveSummaries.filter(g => {
      if (s && !g.name.toLowerCase().includes(s)) return false;
      if (this.selectedEleve && g.name !== this.selectedEleve) return false;
      if (this.selectedMois && !g.payments.some(p => p.mois === this.selectedMois)) return false;
      if (this.selectedStatut && !g.payments.some(p => p.statut === this.selectedStatut)) return false;
      return true;
    });
  }

  get totalCollecte(): number {
    return this.payments.reduce((s, p) => s + p.montantPaye, 0);
  }

  get totalAttendu(): number {
    return this.payments.reduce((s, p) => s + p.montantAttendu, 0);
  }

  getInitials(name: string): string {
    if (!name || !name.trim()) return '?';
    const parts = name.trim().split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  toggleExpand(name: string) {
    this.expandedEleve = this.expandedEleve === name ? '' : name;
  }

  getStatutClass(s: string): string {
    const map: Record<string, string> = { Payé: 'bg-soft-success text-success', 'En attente': 'bg-soft-warning text-warning', Impayé: 'bg-soft-danger text-danger' };
    return map[s] || 'bg-soft-secondary text-secondary';
  }

  openAddForm() {
    this.isEditMode = false;
    this.editId = '';
    this.formEleve = null;
    this.formMois = '';
    this.formMontantAttendu = null;
    this.formMontantPaye = null;
    this.formDatePaiement = new Date().toISOString().split('T')[0];
    this.formTypePaiement = 'Espèces';
    this.formStatut = 'Payé';
    this.formRemarque = '';
    this.modalService.open(this.paymentModal, { centered: true, size: 'md' });
  }

  openEditForm(p: Payment) {
    this.isEditMode = true;
    this.editId = p.id || '';
    this.formEleve = typeof p.eleve === 'object' ? p.eleve as Eleve : (this.eleveList.find(e => `${e.prenom} ${e.nom}` === (p.eleve as string)) || null);
    this.formMois = p.mois;
    this.formMontantAttendu = p.montantAttendu;
    this.formMontantPaye = p.montantPaye;
    this.formDatePaiement = p.datePaiement || '';
    this.formTypePaiement = p.typePaiement;
    this.formStatut = p.statut;
    this.formRemarque = p.remarque || '';
    this.modalService.open(this.paymentModal, { centered: true, size: 'md' });
  }

  save() {
    if (!this.formEleve || this.formMontantAttendu === null || this.formMontantPaye === null) return;

    const elevePayload = typeof this.formEleve === 'object' ? this.formEleve : (this.eleveList.find(e => `${e.prenom} ${e.nom}` === (this.formEleve as any)) || null);

    const data: Payment = {
      eleve: elevePayload as any,
      mois: this.formMois,
      montantAttendu: this.formMontantAttendu,
      montantPaye: this.formMontantPaye,
      datePaiement: this.formDatePaiement,
      typePaiement: this.formTypePaiement,
      statut: this.formStatut,
      remarque: this.formRemarque
    };

    if (this.isEditMode && this.editId) {
      this.service.update(this.editId, data).subscribe({
        next: () => { this.successMessage = 'Paiement modifié avec succès'; this.load(); },
        error: () => this.successMessage = "Erreur lors de la modification"
      });
    } else {
      this.service.create(data).subscribe({
        next: () => { this.successMessage = 'Paiement ajouté avec succès'; this.load(); },
        error: () => this.successMessage = "Erreur lors de l'ajout"
      });
    }

    this.modalService.dismissAll();
    setTimeout(() => this.successMessage = '', 4000);
  }

  delete(id: string) {
    if (!confirm('Supprimer ce paiement ?')) return;
    this.service.delete(id).subscribe({
      next: () => { this.successMessage = 'Paiement supprimé'; this.load(); },
      error: () => this.successMessage = 'Erreur lors de la suppression'
    });
    setTimeout(() => this.successMessage = '', 4000);
  }
}
