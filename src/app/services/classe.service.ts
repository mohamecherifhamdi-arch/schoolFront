import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export class Classe {
  id?: string;
  nom: string;
  niveau: string;
  filiere: string;
  effectif: number;
  anneeScolaire: string;

constructor()
{
  this.nom = '';
  this.niveau = '';
  this.filiere = '';
  this.effectif = 0;
  this.anneeScolaire = '';  
}


}


@Injectable({ providedIn: 'root' })
export class ClasseService {
  private url = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Classe[]> { return this.http.get<Classe[]>(this.url); }
  getById(id: string): Observable<Classe> { return this.http.get<Classe>(`${this.url}/${id}`); }
  create(data: Classe): Observable<Classe> { return this.http.post<Classe>(this.url, data); }
  update(id: string, data: Classe): Observable<Classe> { return this.http.put<Classe>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
