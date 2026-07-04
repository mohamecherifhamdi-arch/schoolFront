import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reservation } from '../demo/models/Reservation';



@Injectable({ providedIn: 'root' })
export class ReservationService {
  private url = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> { return this.http.get<Reservation[]>(this.url); }
  getById(id: string): Observable<Reservation> { return this.http.get<Reservation>(`${this.url}/${id}`); }
  create(data: Reservation): Observable<Reservation> { return this.http.post<Reservation>(this.url, data); }
  update(id: string, data: Reservation): Observable<Reservation> { return this.http.put<Reservation>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  getBySalle(salleId: string): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${this.url}/salle/${salleId}`); }
  getByDate(date: string): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${this.url}/date/${date}`); }
  checkConflict(salleId: string, date: string, seance: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/check`, { params: { salleId, date, seance } });
  }
}
