import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Eleve {
  id?: string;
  nom: string;
  prenom: string;
  classe: string;
  niveau: string;
  telephone: string;
  email: string;
  statut: string;
}

@Injectable({ providedIn: 'root' })
export class EleveService {
  private url = `${environment.apiUrl}/eleves`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Eleve[]> { return this.http.get<Eleve[]>(this.url); }
  getById(id: string): Observable<Eleve> { return this.http.get<Eleve>(`${this.url}/${id}`); }
  create(data: Eleve): Observable<Eleve> { return this.http.post<Eleve>(this.url, data); }
  update(id: string, data: Eleve): Observable<Eleve> { return this.http.put<Eleve>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
