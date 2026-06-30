import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherDashboardService, TeacherDashboardResponse, PlanningParJour, TeacherSuggestion } from '../../../services/teacher-dashboard.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {
  teacherName = '';
  data: TeacherDashboardResponse | null = null;
  loading = false;
  error = '';
  suggestions: TeacherSuggestion[] = [];
  allTeachers: TeacherSuggestion[] = [];
  showSuggestions = false;
  selectedIndex = -1;

  constructor(private service: TeacherDashboardService) {}

  ngOnInit() {
    this.service.getTeachers().subscribe({
      next: list => this.allTeachers = list,
      error: () => {}
    });
  }

  onSearchInput() {
    const q = this.teacherName.toLowerCase().trim();
    if (q.length < 1) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }
    this.suggestions = this.allTeachers.filter(t =>
      t.fullName.toLowerCase().includes(q) ||
      t.nom.toLowerCase().includes(q) ||
      t.prenom.toLowerCase().includes(q) ||
      t.matiere.toLowerCase().includes(q)
    ).slice(0, 8);
    this.showSuggestions = this.suggestions.length > 0;
    this.selectedIndex = -1;
  }

  selectSuggestion(t: TeacherSuggestion) {
    this.teacherName = t.fullName;
    this.showSuggestions = false;
    this.search();
  }

  hideSuggestions() {
    setTimeout(() => this.showSuggestions = false, 200);
  }

  onSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
    } else if (e.key === 'Enter' && this.selectedIndex >= 0) {
      e.preventDefault();
      this.selectSuggestion(this.suggestions[this.selectedIndex]);
    } else if (e.key === 'Escape') {
      this.showSuggestions = false;
    }
  }

  search() {
    if (!this.teacherName.trim()) return;
    this.loading = true;
    this.error = '';
    this.data = null;
    this.showSuggestions = false;
    this.service.getDashboard(this.teacherName.trim()).subscribe({
      next: d => { this.data = d; this.loading = false; },
      error: () => { this.error = 'Erreur de chargement du dashboard'; this.loading = false; }
    });
  }

  hasCoursToday(jour: PlanningParJour): boolean {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return jour.date === todayStr;
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'danger': return 'ti ti-alert-triangle';
      case 'warning': return 'ti ti-alert-circle';
      default: return 'ti ti-info-circle';
    }
  }
}
