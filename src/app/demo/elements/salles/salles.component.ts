import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalleService } from '../../../services/salle.service';
import { ReservationService } from '../../../services/reservation.service';
import { EnseignantService, Enseignant } from '../../../services/enseignant.service';
import { ClasseService, Classe } from '../../../services/classe.service';
import { AddRoomRequest } from '../../models/addRoomRequest';
import { Reservation } from '../../models/Reservation';
import { Room as Salle } from '../../models/Room';
import { Session } from '../../models/Session';



@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salles.component.html',
  styleUrls: ['./salles.component.scss']
})
export class SallesComponent implements OnInit {
  isEditMode = false;
  editRoomId: string | null = null;

  rooms: Salle[] = [];

  teachers: Enseignant[] = [];
  classes: Classe[] = [];

  sessions: Session[] = [
    new Session('S1', 'Séance 1', '08:30 - 10:00'),
    new Session('S2', 'Séance 2', '10:15 - 11:45'),
    new Session('S3', 'Séance 3', '12:00 - 13:30'),
    new Session('S4', 'Séance 4', '14:00 - 15:30'),
    new Session('S5', 'Séance 5', '15:45 - 17:15')
  ];

  reservations: Reservation[] = [];

  activeFormTab: 'reservation' | 'room' = 'reservation';
  searchTerm = '';
  filterRoom = '';
  filterTeacher = '';
  filterDate = '';

  selectedRoomId = '';
  selectedTeacherId = '';
  selectedClassId = '';
  selectedDate = '';
  selectedSessionId = '';

  /*newRoomName = '';
  newRoomType: string = '';// = 'Cours';
  newRoomCapacity: number | null = null;
  newRoomEquipment = '';*/
  equipementOptions = ['Tableau', 'Projecteur', 'Climatisation', 'Microscope', 'Paillasses', 'Ordinateur', 'Vidéoprojecteur', 'Tableau interactif'];
  addRoomRequest:AddRoomRequest = new AddRoomRequest();

  successMessage = '';
  errorMessage = '';
  validationConflict = '';
  loading = true;

  constructor(
    private salleService: SalleService,
    private resaService: ReservationService,
    private enseignantService: EnseignantService,
    private classeService: ClasseService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.salleService.getAll().subscribe({
      next: data => {
        this.rooms = data;
        this.loadReservations();
        this.loadTeachers();
        this.loadClasses();
      },
      error: () => { this.loading = false; }
    });
  }

  loadTeachers() {
    this.enseignantService.getAll().subscribe({
      next: data => { this.teachers = data; }
    });
  }

  loadClasses() {
    this.classeService.getAll().subscribe({
      next: data => { this.classes = data; }
    });
  }

  loadReservations() {
    this.resaService.getAll().subscribe({
      next: data => {
        this.reservations = data;
        console.log('Reservations loaded:', this.reservations);
        this.updateRoomStatuses();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  updateRoomStatuses(date?: string, sessionLabel?: string) {
    const targetDate = date || new Date().toISOString().slice(0, 10);
    this.rooms.forEach(room => {
      if (room.statut === 'Maintenance') return;
      const isOccupied = sessionLabel
        ? this.reservations.some(res => res.salle?.id === room.id && res.date === targetDate && res.session === sessionLabel)
        : this.reservations.some(res => res.salle?.id === room.id && res.date === targetDate);
      room.statut = isOccupied ? 'Occupée' : 'Libre';
    });
  }

  get totalRoomsCount() { return this.rooms.length; }
  get availableRoomsCount() { return this.rooms.filter(r => r.statut === 'Libre').length; }
  get occupiedRoomsCount() { return this.rooms.filter(r => r.statut === 'Occupée').length; }
  get maintenanceRoomsCount() { return this.rooms.filter(r => r.statut === 'Maintenance').length; }

  get filteredReservations(): Reservation[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.reservations.filter(res => {
      const roomName = res.salle?.nom || '';
      const teacherName = (res.enseignant?.prenom || '') + ' ' + (res.enseignant?.nom || '');
      const ms = !term || roomName.toLowerCase().includes(term) || teacherName.toLowerCase().includes(term) || res.className.toLowerCase().includes(term) || res.subject.toLowerCase().includes(term);
      return ms && (!this.filterRoom || res.salle?.id === this.filterRoom) && (!this.filterTeacher || teacherName === this.filterTeacher) && (!this.filterDate || res.date === this.filterDate);
    });
  }

  openAddRoomForm() {
    this.isEditMode = false; this.editRoomId = null;
    this.addRoomRequest = new AddRoomRequest();
    this.activeFormTab = 'room';
  }

  openEditRoomForm(room: Salle) {
    this.editRoomId = room.id || null; 
    this.isEditMode = true;
    this.addRoomRequest = new AddRoomRequest(room.nom, room.batiment, room.capacite, [...room.equipement], room.statut);
    this.activeFormTab = 'room';
    setTimeout(() => document.getElementById('reservationFormCard')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  closeRoomForm() { this.isEditMode = false; this.editRoomId = null; }

  onEquipChange(opt: string) { ///////////////????????????
    const idx = this.addRoomRequest.newRoomEquipment.indexOf(opt);
    if (idx >= 0) this.addRoomRequest.newRoomEquipment.splice(idx, 1);
    else this.addRoomRequest.newRoomEquipment.push(opt);
  }

  addRoom() { //DONE
    if (!this.addRoomRequest.newRoomName || !this.addRoomRequest.newRoomCapacity) return;
    const apiData = {
      nom: this.addRoomRequest.newRoomName.trim(),
      capacite: this.addRoomRequest.newRoomCapacity, batiment: this.addRoomRequest.newRoomType === 'T.P.' ? 'Labo' : this.addRoomRequest.newRoomType, etage: 1, statut: this.addRoomRequest.newRoomStatus,
      equipement: this.addRoomRequest.newRoomEquipment
    };
    (this.isEditMode && this.editRoomId
      ? this.salleService.update(this.editRoomId, apiData)
      : this.salleService.create(apiData)
    ).subscribe({
      next: (room) => {
        this.successMessage = this.isEditMode ? 'Salle modifiée' : 'Salle ajoutée';
        if (this.isEditMode && this.editRoomId) {
          this.rooms = this.rooms.map((existing) =>
            existing.id === this.editRoomId ? room : existing
          );
        } else {
          this.rooms = [...this.rooms, room];
        }
        this.updateRoomStatuses();
      },
      error: () => this.errorMessage = 'Erreur...'
    });
    this.closeRoomForm();
    setTimeout(() => this.successMessage = '', 4000);
  }

  deleteRoom(roomId: string) { ////////////////////////DONE
    const room = this.rooms.find(r => r.id === roomId);
   // if (!room) return;
    this.salleService.delete(roomId).subscribe({ error: () => {} });
    this.rooms = this.rooms.filter(r => r.id !== roomId);
    //const ids = this.reservations.filter(r => r.roomId === roomId).map(r => r.roomId).filter(Boolean) as string[];
    //ids.forEach(id => this.resaService.delete(id).subscribe({ error: () => {} }));
    this.reservations = this.reservations.filter(r => r.salle?.id !== roomId);
    this.updateRoomStatuses();
    this.successMessage = `Salle ${room?.nom} supprimée`;
    if (this.selectedRoomId === roomId) this.selectedRoomId = '';
    setTimeout(() => this.successMessage = '', 4000);
  }

  onFormChange() { ////////////////////////////DONE
    this.errorMessage = '';
    const session = this.sessions.find(s => s.id === this.selectedSessionId);
    const sessionLabel = session ? `${session.label} (${session.timeRange})` : '';
   // this.updateRoomStatuses(this.selectedDate || undefined, sessionLabel || undefined);
    if (!this.selectedRoomId || !this.selectedDate || !this.selectedSessionId) return;
    const room = this.rooms.find(r => r.id === this.selectedRoomId);
    if (room?.statut === 'Maintenance') { this.errorMessage = `Salle ${room.nom} en maintenance`; return; }
    const roomTaken = this.reservations.some(r => r.salle?.id === this.selectedRoomId && r.date === this.selectedDate && r.session === sessionLabel);
    if (roomTaken) { this.errorMessage = `Salle occupée ${this.selectedDate} ${session?.label}`; return; }
    if (this.selectedTeacherId) {
     // const teacher = this.teachers.find(t => t.id === this.selectedTeacherId);
     /* if (this.reservations.some(r => r.teacherName === teacher?.name && r.date === this.selectedDate && r.session === sessionLabel))
        this.errorMessage = `${teacher?.name} déjà occupé`;*/
    }
  }

  submitReservation() {                 //DOOOOOONNNNE
    if (!this.selectedRoomId || !this.selectedTeacherId || !this.selectedClassId || !this.selectedDate || !this.selectedSessionId)
      { this.errorMessage = 'Remplissez tous les champs'; return; }
    const room = this.rooms.find(r => String(r.id) === String(this.selectedRoomId));
    const teacher = this.teachers.find(t => String(t.id) === String(this.selectedTeacherId));
    const schoolClass = this.classes.find(c => String(c.id) === String(this.selectedClassId));
    const session = this.sessions.find(s => s.id === this.selectedSessionId);
    if (!room || !teacher || !schoolClass || !session) {
      console.error('Reservation lookup failed', {
        selectedRoomId: this.selectedRoomId,
        selectedTeacherId: this.selectedTeacherId,
        selectedClassId: this.selectedClassId,
        room,
        teacher,
        schoolClass,
        session
      });
      this.errorMessage = 'Erreur réservation';
      return;
    }
    const sessionLabel = `${session.label} (${session.timeRange})`;
    if (room.statut === 'Maintenance') { this.errorMessage = `Salle ${room.nom} en maintenance`; return; }
    if (this.reservations.some(r => r.salle?.id === room.id && r.date === this.selectedDate && r.session === sessionLabel))
      { this.errorMessage = `Salle déjà réservée`; return; }



         const matiere = teacher.matieres?.[0]?.nom || '';
         const request = {
            enseignant: { id: teacher.id },
            salleId: room.id,
            salleNom: room.nom,
            classe: schoolClass.nom,
            date: this.selectedDate,
            seance: sessionLabel,
            matiere
         };
        this.resaService.create(request as any).subscribe({
          next: (created) => {
            const savedReservation = {
              ...request,
              ...created,
              id: created.id ?? created.id ?? '',
              salle: created.salle ?? { id: room.id, nom: room.nom },
              enseignant: created.enseignant ?? { id: teacher.id, prenom: teacher.prenom, nom: teacher.nom },
              className: created.className ?? created.className ?? schoolClass.nom,
              session: created.session
            } as any;
            this.reservations.unshift(savedReservation);
            this.updateRoomStatuses();
            this.successMessage = `Réservée : ${room.nom}`;
            this.selectedRoomId = ''; this.selectedTeacherId = ''; this.selectedClassId = ''; this.selectedDate = ''; this.selectedSessionId = '';
            setTimeout(() => this.successMessage = '', 4000);
          },
          error: (err) => {
            console.error('Reservation create error', err);
            const message = err?.error?.message || err?.message || 'Erreur réservation';
            this.errorMessage = message;
          }
        });
    /*  },
      error: () => this.errorMessage = 'Erreur vérification conflit'*/
  //  });
  }

  deleteReservation(id: string) { ////DONE
    //if (idx === -1) return;
   // resa = this.reservations[idx];
    //if (resa._apiId) 
    //alert(id);
    const idx = this.reservations.findIndex(r => r.id === id);
    this.resaService.delete(id).subscribe({ error: () => {} });
    this.reservations.splice(idx, 1);
    this.updateRoomStatuses();
    this.successMessage = `Réservation annulée`;
    setTimeout(() => this.successMessage = '', 4000);
  }

  bookRoomDirectly(room: Salle) {
    if (room.statut === 'Maintenance') return;
    if (!room.id) return;
    this.selectedRoomId = room.id;
    this.onFormChange();
    setTimeout(() => document.getElementById('reservationFormCard')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}
