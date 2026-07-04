import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Reclamation {
  id?: string;
  enseignant: any;
  eleve: any;
  date?: string;
  cause: string;
  penalite: string;
  statut: string;
}

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private url = `${environment.apiUrl}/reclamations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(this.url); }
  getById(id: string): Observable<Reclamation> { return this.http.get<Reclamation>(`${this.url}/${id}`); }
  create(data: Reclamation): Observable<Reclamation> { return this.http.post<Reclamation>(this.url, data); }
  update(id: string, data: Reclamation): Observable<Reclamation> { return this.http.put<Reclamation>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByStatut(statut: string): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(`${this.url}/statut/${statut}`); }
}
