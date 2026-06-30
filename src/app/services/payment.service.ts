import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Eleve } from './eleve.service';

export interface Payment {
  id?: string;
  eleve: Eleve | string | null;
  mois: string;
  montantAttendu: number;
  montantPaye: number;
  datePaiement: string;
  typePaiement: string;
  statut: string;
  remarque: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Payment[]> { return this.http.get<Payment[]>(this.url); }
  getById(id: string): Observable<Payment> { return this.http.get<Payment>(`${this.url}/${id}`); }
  create(data: Payment): Observable<Payment> { return this.http.post<Payment>(this.url, data); }
  update(id: string, data: Payment): Observable<Payment> { return this.http.put<Payment>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByEleve(eleve: string): Observable<Payment[]> { return this.http.get<Payment[]>(`${this.url}/eleve/${eleve}`); }
}
