import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Absence {
  id?: number;
  enseignant: any;
  classe: string;
  salle: string;
  date: string;
  seance: string;
  justifie: boolean;
  motif: string;
}

@Injectable({ providedIn: 'root' })
export class AbsenceService {
  private url = `${environment.apiUrl}/absences`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Absence[]> { return this.http.get<Absence[]>(this.url); }
  getById(id: number): Observable<Absence> { return this.http.get<Absence>(`${this.url}/${id}`); }
  create(data: Absence): Observable<Absence> { return this.http.post<Absence>(this.url, data); }
  update(id: number, data: Absence): Observable<Absence> { return this.http.put<Absence>(`${this.url}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByEnseignant(enseignantId: number): Observable<Absence[]> { return this.http.get<Absence[]>(`${this.url}/enseignant/${enseignantId}`); }
}
