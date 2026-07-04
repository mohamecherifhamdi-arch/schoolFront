import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalParents: number;
  totalSubjects: number;
  totalAbsences: number;
  totalPayments: number;
  totalRooms: number;
  attendanceRate: number;
  recentAbsences: Array<{
    className: string;
    details: string;
    badge: string;
    badgeClass: string;
    icon: string;
    iconClass: string;
    tag: string;
  }>;
  upcomingEvents: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  performanceHighlights: Array<{
    title: string;
    detail: string;
    value: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.url}/stats`);
  }
}
