import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Admin {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  invitationToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private url = `${environment.apiUrl}/admins`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Admin[]> { return this.http.get<Admin[]>(this.url); }
  getById(id: number): Observable<Admin> { return this.http.get<Admin>(`${this.url}/${id}`); }
  create(data: Admin): Observable<Admin> { return this.http.post<Admin>(this.url, data); }
  update(id: number, data: Admin): Observable<Admin> { return this.http.put<Admin>(`${this.url}/${id}`, data); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  findByStatus(status: string): Observable<Admin[]> { return this.http.get<Admin[]>(`${this.url}/status/${status}`); }
  acceptInvitation(token: string): Observable<Admin> { return this.http.post<Admin>(`${this.url}/accept-invitation`, { token }); }
  resendInvitation(id: number): Observable<Admin> { return this.http.post<Admin>(`${this.url}/${id}/resend-invitation`, {}); }
}
