import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Parent {
  id?: string;
  nom: string;
  adresse: string;
  telephone: string;
  email?: string;
  eleves?: any[];
  classe?: string;
  statut?: string;
}

@Injectable({ providedIn: 'root' })
export class ParentService {
  private url = `${environment.apiUrl}/parents`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Parent[]> { return this.http.get<Parent[]>(this.url); }
  getById(id: string): Observable<Parent> { return this.http.get<Parent>(`${this.url}/${id}`); }
  create(data: Parent): Observable<Parent> { return this.http.post<Parent>(this.url, data); }
  update(id: string, data: Parent): Observable<Parent> { return this.http.put<Parent>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  search(nom: string): Observable<Parent[]> { return this.http.get<Parent[]>(`${this.url}/search?nom=${nom}`); }
}
