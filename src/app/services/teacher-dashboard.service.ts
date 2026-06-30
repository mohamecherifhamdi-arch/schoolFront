import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TeacherInfo {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  matiere: string;
  statut: string;
}

export interface DashboardStats {
  totalCours: number;
  totalAbsences: number;
  totalEleves: number;
  totalReservations: number;
  tauxPresence: number;
  heuresTotales: number;
  coursSemaineDerniere: number;
  absencesNonJustifiees: number;
  moyenneGeneraleNotes: number;
  totalNotes: number;
}

export interface PlanningItem {
  id: string;
  matiere: string;
  classe: string;
  salle: string;
  date: string;
  heureDebut: string;
  heureFin: string;
}

export interface PlanningParJour {
  jour: string;
  date: string;
  cours: PlanningItem[];
}

export interface AbsenceItem {
  id: string;
  date: string;
  seance: string;
  classe: string;
  justifie: boolean;
  motif: string;
}

export interface NoteItem {
  eleve: string;
  matiere: string;
  classe: string;
  valeur: number;
  type: string;
  date: string;
}

export interface ReservationItem {
  id: string;
  salleNom: string;
  date: string;
  seance: string;
  classe: string;
  matiere: string;
}

export interface ClasseStat {
  classe: string;
  totalCours: number;
  absences: number;
  tauxAbsence: number;
  moyenneNotes: number;
  totalNotes: number;
  effectif: number;
}

export interface Alerte {
  type: string;
  message: string;
  entite: string;
}

export interface TeacherSuggestion {
  nom: string;
  prenom: string;
  matiere: string;
  fullName: string;
}

export interface TeacherDashboardResponse {
  teacherName: string;
  teacherInfo: TeacherInfo;
  stats: DashboardStats;
  planningSemaine: PlanningParJour[];
  absences: AbsenceItem[];
  notesRecent: NoteItem[];
  reservations: ReservationItem[];
  statsParClasse: ClasseStat[];
  alertes: Alerte[];
}

@Injectable({ providedIn: 'root' })
export class TeacherDashboardService {
  private url = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard(teacherName: string): Observable<TeacherDashboardResponse> {
    return this.http.get<TeacherDashboardResponse>(`${this.url}/${encodeURIComponent(teacherName)}`);
  }

  getTeachers(): Observable<TeacherSuggestion[]> {
    return this.http.get<TeacherSuggestion[]>(`${this.url}/teachers`);
  }

  getResume(teacherName: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${encodeURIComponent(teacherName)}/resume`);
  }
}
