import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanningService, Planning as PlanningApi } from '../../../services/planning.service';
import { EnseignantService, Enseignant } from '../../../services/enseignant.service';
import { MatiereService, Matiere } from '../../../services/matiere.service';
import { SalleService } from '../../../services/salle.service';
import { Room as Salle } from '../../models/Room';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-planning-enseignants',
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './planning-enseignants.component.html',
  styleUrls: ['./planning-enseignants.component.scss']
})
export class PlanningEnseignantsComponent implements OnInit {
  @ViewChild('planningModal') planningModal!: TemplateRef<any>;

  isEditMode = false;
  editApiId: string | null = null;
  successAlert = '';

  formDate = '';
  formPeriod = '';
  formTeacher = '';
  formSubject = '';
  formRoom = '';
  formType = 'Cours';

  schedule: PlanningApi[] = [];

  enseignants: Enseignant[] = [];
  matieres: Matiere[] = [];
  salles: Salle[] = [];
  eventTypes = ['Cours', 'TD', 'TP', 'Examen', 'Réunion'];
  timeSlots = [
    '08:00 - 09:30',
    '08:00 - 10:00',
    '09:00 - 10:30',
    '10:00 - 12:00',
    '10:30 - 12:00',
    '10:30 - 12:30',
    '14:00 - 15:30',
    '14:00 - 16:00',
    '14:00 - 16:30'
  ];

  calPlugins = [dayGridPlugin, interactionPlugin];

  typeColors: Record<string, string> = {
    'Cours': '#4f46e5',
    'TD': '#10b981',
    'TP': '#f59e0b',
    'Examen': '#ef4444',
    'Réunion': '#8b5cf6'
  };

  calOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'fr',
    firstDay: 1,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    buttonText: {
      today: 'Mois courant',
      prev: '<',
      next: '>'
    },
    height: 600,
    weekends: false,
    dateClick: (info) => this.openAddForm(info.dateStr),
    eventClick: (info) => this.openEditForm(info),
    events: [],
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  };

  constructor(
    private modalService: NgbModal,
    private service: PlanningService,
    private enseignantService: EnseignantService,
    private matiereService: MatiereService,
    private salleService: SalleService
  ) {}

  ngOnInit() { 
    this.enseignantService.getAll().subscribe({
      next: data => this.enseignants = data,
      error: () => {}
    });
    this.matiereService.getAll().subscribe({
      next: data => this.matieres = data,
      error: () => {}
    });
    this.salleService.getAll().subscribe({
      next: data => this.salles = data,
      error: () => {}
    });
    this.loadPlannings();
  }

  loadPlannings() {
    this.service.getAll().subscribe({
      next: data => {
        this.schedule = data;
        this.calOptions = {
          ...this.calOptions,
          events: this.schedule.map(p => ({
            id: String(p.id),
            title: (p.type || 'Cours') + ' - ' + (p.enseignant || ''),
            start: p.date ? p.date + 'T' + (p.heureDebut || '00:00') : undefined,
            end: p.date ? p.date + 'T' + (p.heureFin || '23:59') : undefined,
            backgroundColor: this.typeColors[p.type || 'Cours'] || '#4f46e5',
            borderColor: this.typeColors[p.type || 'Cours'] || '#4f46e5',
            textColor: '#fff',
            extendedProps: {
              enseignant: p.enseignant || '',
              matiere: p.matiere || '',
              classe: p.classe || '',
              salle: p.salle || '',
              type: p.type || 'Cours',
              heureDebut: p.heureDebut || '',
              heureFin: p.heureFin || ''
            }
          }))
        };
      },
      error: () => {}
    });
  }

  openAddForm(date?: string) {
    this.isEditMode = false;
    this.editApiId = null;
    this.formDate = date || this.getCurrentDate();
    this.formPeriod = '';
    this.formTeacher = '';
    this.formSubject = '';
    this.formRoom = '';
    this.formType = 'Cours';
    this.modalService.open(this.planningModal, { centered: true, size: 'lg', windowClass: 'planning-modal' });
  }

  openEditForm(info: any) {
    const props = info.event.extendedProps;
    this.isEditMode = true;
    this.editApiId = info.event.id;
    this.formDate = info.event.startStr.slice(0, 10);
    this.formPeriod = (props.heureDebut || '') + ' - ' + (props.heureFin || '');
    this.formTeacher = props.enseignant;
    this.formSubject = props.matiere;
    this.formRoom = props.salle;
    this.formType = props.type || 'Cours';
    this.modalService.open(this.planningModal, { centered: true, size: 'lg', windowClass: 'planning-modal' });
  }

  editFromTable(item: PlanningApi) {
    this.isEditMode = true;
    this.editApiId = item.id ? String(item.id) : null;
    this.formDate = item.date || '';
    this.formPeriod = (item.heureDebut || '') + ' - ' + (item.heureFin || '');
    this.formTeacher = item.enseignant || '';
    this.formSubject = item.matiere || '';
    this.formRoom = item.salle || '';
    this.formType = item.type || 'Cours';
    this.modalService.open(this.planningModal, { centered: true, size: 'lg', windowClass: 'planning-modal' });
  }

  closeForm() {
    this.isEditMode = false;
    this.editApiId = null;
    this.modalService.dismissAll();
  }

  saveSession() {
    if (!this.formDate || !this.formPeriod || !this.formTeacher || !this.formSubject || !this.formRoom) return;

    const periodParts = this.formPeriod.split(' - ');
    const data: PlanningApi = {
      enseignant: this.formTeacher.trim(),
      matiere: this.formSubject.trim(),
      salle: this.formRoom.trim(),
      classe: '',
      date: this.formDate,
      heureDebut: periodParts[0] || this.formPeriod,
      heureFin: periodParts[1] || '',
      type: this.formType
    };

    if (this.isEditMode && this.editApiId) {
      this.service.update(this.editApiId, data).subscribe({
        next: () => {
          this.successAlert = 'Séance mise à jour';
          this.loadPlannings();
          this.closeForm();
        },
        error: () => this.successAlert = 'Erreur modification'
      });
    } else {
      this.service.create(data).subscribe({
        next: () => {
          this.successAlert = 'Séance ajoutée';
          this.loadPlannings();
          this.closeForm();
        },
        error: () => this.successAlert = 'Erreur ajout'
      });
    }
    setTimeout(() => this.successAlert = '', 4000);
  }

  deleteSession() {
    if (!this.editApiId) return;
    if (!confirm('Supprimer cette séance ?')) return;
    this.service.delete(this.editApiId).subscribe({
      next: () => {
        this.successAlert = 'Séance supprimée';
        this.loadPlannings();
        this.closeForm();
      },
      error: () => {}
    });
    setTimeout(() => this.successAlert = '', 4000);
  }

  ouvrirAjoutDepuisBouton() {
    this.openAddForm();
  }

  private getCurrentDate(): string {
    const d = new Date();
    const annee = d.getFullYear();
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    const jour = String(d.getDate()).padStart(2, '0');
    return annee + '-' + mois + '-' + jour;
  }
}
