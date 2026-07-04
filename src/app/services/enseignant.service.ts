import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Enseignant {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  matieres: any[];
  statut: string;
  absences?: any[];
}

@Injectable({ providedIn: 'root' })
export class EnseignantService {
  private url = `${environment.apiUrl}/enseignants`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Enseignant[]> { return this.http.get<Enseignant[]>(this.url); }
  getById(id: string): Observable<Enseignant> { return this.http.get<Enseignant>(`${this.url}/${id}`); }
  create(data: Enseignant): Observable<Enseignant> { return this.http.post<Enseignant>(this.url, data); }
  update(id: string, data: Enseignant): Observable<Enseignant> { return this.http.put<Enseignant>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
