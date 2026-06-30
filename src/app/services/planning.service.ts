import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Planning {
  id?: string;
  enseignant: string;
  matiere: string;
  classe: string;
  salle: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class PlanningService {
  private url = `${environment.apiUrl}/plannings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Planning[]> { return this.http.get<Planning[]>(this.url); }
  getById(id: string): Observable<Planning> { return this.http.get<Planning>(`${this.url}/${id}`); }
  create(data: Planning): Observable<Planning> { return this.http.post<Planning>(this.url, data); }
  update(id: string, data: Planning): Observable<Planning> { return this.http.put<Planning>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByDate(date: string): Observable<Planning[]> { return this.http.get<Planning[]>(`${this.url}/date/${date}`); }
  findByRange(debut: string, fin: string): Observable<Planning[]> { return this.http.get<Planning[]>(`${this.url}/range?debut=${debut}&fin=${fin}`); }
}
