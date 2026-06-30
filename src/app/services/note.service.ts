import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Eleve } from './eleve.service';
import { Classe } from './classe.service';
import { Matiere } from './matiere.service';

export interface Note {
  id?: string;
  eleve: Eleve | string | null;
  matiere: Matiere | null;
  classe: Classe | string | null;
  type: string;
  valeur: number;
  coefficient: number;
  date: string;
  statut: string;
}

@Injectable({ providedIn: 'root' })
export class NoteService {
  private url = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Note[]> { return this.http.get<Note[]>(this.url); }
  getById(id: string): Observable<Note> { return this.http.get<Note>(`${this.url}/${id}`); }
  create(data: Note): Observable<Note> { return this.http.post<Note>(this.url, data); }
  update(id: string, data: Note): Observable<Note> { return this.http.put<Note>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByEleve(eleve: string): Observable<Note[]> { return this.http.get<Note[]>(`${this.url}/eleve/${eleve}`); }
  findByClasse(classe: string): Observable<Note[]> { return this.http.get<Note[]>(`${this.url}/classe/${classe}`); }
}
