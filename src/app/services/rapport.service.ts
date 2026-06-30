import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Rapport {
  id?: string;
  titre: string;
  eleve?: any;
  jurys?: string[];
  remarque?: string;
  date: string;
  statut: string;
  bibliotheque?: boolean;
}

@Injectable({ providedIn: 'root' })
export class RapportService {
  private url = `${environment.apiUrl}/rapports`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Rapport[]> { return this.http.get<Rapport[]>(this.url); }
  getById(id: string): Observable<Rapport> { return this.http.get<Rapport>(`${this.url}/${id}`); }
  create(data: Rapport): Observable<Rapport> { return this.http.post<Rapport>(this.url, data); }
  update(id: string, data: Rapport): Observable<Rapport> { return this.http.put<Rapport>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByStatut(statut: string): Observable<Rapport[]> { return this.http.get<Rapport[]>(`${this.url}/statut/${statut}`); }
}
