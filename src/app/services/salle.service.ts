import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Room } from '../demo/models/Room';


@Injectable({ providedIn: 'root' })
export class SalleService {
  private url = `${environment.apiUrl}/salles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Room[]> { return this.http.get<Room[]>(this.url); }
  getById(id: string): Observable<Room> { return this.http.get<Room>(`${this.url}/${id}`); }
  create(data: Room): Observable<Room> { return this.http.post<Room>(this.url, data); }
  update(id: string, data: Room): Observable<Room> { return this.http.put<Room>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
