import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbsenceService, Absence } from '../../../services/absence.service';
import { ClasseService, Classe } from '../../../services/classe.service';
import { EnseignantService, Enseignant } from '../../../services/enseignant.service';
import { SalleService } from '../../../services/salle.service';
import { Room as Salle } from '../../models/Room';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-absence',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss']
})
export class AbsenceComponent implements OnInit {

  @ViewChild('absenceModal') absenceModal!: TemplateRef<any>;

  listeAbsences: Absence[] = [];

  messageSucces = '';

  modeEdition = false;
  idEdition: number | null = null;

  formulaireDate = '';
  formulaireClasse = '';
  formulaireEnseignant: any = null;
  formulaireSalle = '';
  formulaireCouleur = 'primary';

  classes: Classe[] = [];
  enseignants: Enseignant[] = [];
  salles: Salle[] = [];

  calPlugins = [dayGridPlugin, interactionPlugin];

  calOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'fr',
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
    height: 'auto',
    weekends: false,
    dateClick: (info) => this.ouvrirAjout(info.dateStr),
    eventClick: (info) => this.ouvrirEditionAvecId(info),
    events: []
  };

  constructor(
    private modalService: NgbModal,
    private absenceService: AbsenceService,
    private classeService: ClasseService,
    private enseignantService: EnseignantService,
    private salleService: SalleService
  ) {}

  ngOnInit(): void {
    this.chargerAbsences();
    this.chargerSelecteurs();
  }

  chargerSelecteurs(): void {
    this.classeService.getAll().subscribe({
      next: (data) => (this.classes = data),
      error: () => {}
    });
    this.enseignantService.getAll().subscribe({
      next: (data) => (this.enseignants = data),
      error: () => {}
    });
    this.salleService.getAll().subscribe({
      next: (data) => (this.salles = data),
      error: () => {}
    });
  }

  chargerAbsences(): void {
    this.absenceService.getAll().subscribe({
      next: (data) => {
        this.listeAbsences = data;
        this.calOptions = {
          ...this.calOptions,
          events: this.listeAbsences.map((a) => ({
            id: String(a.id),
            title: (a.enseignant?.prenom || '') + ' ' + (a.enseignant?.nom || '') + ' - ' + a.classe,
            date: a.date ? a.date.slice(0, 10) : '',
            backgroundColor: a.justifie ? '#10b981' : '#ef4444',
            borderColor: a.justifie ? '#10b981' : '#ef4444',
            textColor: '#fff',
            extendedProps: {
              enseignant: a.enseignant,
              classe: a.classe,
              salle: a.salle,
              justifie: a.justifie,
              motif: a.motif
            }
          }))
        };
      },
      error: () => {}
    });
  }

  ouvrirAjout(date?: string): void {
    this.modeEdition = false;
    this.idEdition = null;
    this.formulaireDate = date ? date : this.getCurrentDate();
    this.formulaireClasse = '';
    this.formulaireEnseignant = null;
    this.formulaireSalle = '';
    this.formulaireCouleur = 'primary';

    this.modalService.open(this.absenceModal, {
      centered: true,
      size: 'lg',
      windowClass: 'absence-modal'
    });
  }

  ouvrirEditionAvecId(info: any): void {
    const props = info.event.extendedProps;
    this.modeEdition = true;
    this.idEdition = parseInt(info.event.id, 10);
    this.formulaireDate = info.event.startStr.slice(0, 10);
    this.formulaireClasse = props.classe;
    this.formulaireEnseignant = props.enseignant;
    this.formulaireSalle = props.salle;
    this.formulaireCouleur = props.justifie ? 'success' : 'danger';

    this.modalService.open(this.absenceModal, {
      centered: true,
      size: 'lg',
      windowClass: 'absence-modal'
    });
  }

  supprimer(): void {
    if (!this.idEdition){
      this.messageSucces = 'Erreur';
      return; }

    this.absenceService.delete(this.idEdition).subscribe({
      next: () => {
        this.listeAbsences = this.listeAbsences.filter((a) => a.id !== this.idEdition);
        this.mettreAJourCalendrier();
        this.messageSucces = 'Absence supprimee';
        this.modalService.dismissAll();
        setTimeout(() => (this.messageSucces = ''), 4000);
      },
      error: () => {}
    });
  }

  sauvegarder(): void {
    if (!this.formulaireClasse || !this.formulaireEnseignant || !this.formulaireDate) return;

    const data: Absence = {
      enseignant: this.formulaireEnseignant,
      classe: this.formulaireClasse,
      salle: this.formulaireSalle,
      seance: '',
      date: this.formulaireDate,
      justifie: this.formulaireCouleur === 'success',
      motif: '',
      id: this.idEdition ?? undefined
    };

    if (this.modeEdition && this.idEdition) {
      this.absenceService.update(this.idEdition, data).subscribe({
        next: (updatedAbsence) => {
          this.messageSucces = 'Absence mise a jour';
          this.listeAbsences = this.listeAbsences.map((absence) =>
            absence.id === this.idEdition ? updatedAbsence : absence
          );
          this.mettreAJourCalendrier();
        },
        error: () => {
          this.messageSucces = 'Erreur modification';
        }
      });
    } else {
      this.absenceService.create(data).subscribe({
        next: (createdAbsence) => {
          this.messageSucces = 'Absence enregistree';
          this.listeAbsences = [...this.listeAbsences, createdAbsence];
          this.mettreAJourCalendrier();
        },
        error: () => {
          this.messageSucces = 'Erreur';
        }
      });
    }

    this.modalService.dismissAll();
    setTimeout(() => (this.messageSucces = ''), 4000);
  }

  private mettreAJourCalendrier(): void {
    this.calOptions = {
      ...this.calOptions,
      events: this.listeAbsences.map((a) => ({
        id: String(a.id),
        title: (a.enseignant?.prenom || '') + ' ' + (a.enseignant?.nom || '') + ' - ' + a.classe,
        date: a.date ? a.date.slice(0, 10) : '',
        backgroundColor: a.justifie ? '#10b981' : '#ef4444',
        borderColor: a.justifie ? '#10b981' : '#ef4444',
        textColor: '#fff',
        extendedProps: {
          enseignant: a.enseignant,
          classe: a.classe,
          salle: a.salle,
          justifie: a.justifie,
          motif: a.motif
        }
      }))
    };
  }

  private getCurrentDate(): string {
    const d = new Date();
    const annee = d.getFullYear();
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    const jour = String(d.getDate()).padStart(2, '0');
    return annee + '-' + mois + '-' + jour;
  }

  compareEnseignant(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.id === e2.id : e1 === e2;
  }
}
