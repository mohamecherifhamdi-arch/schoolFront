import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BajajChartComponent } from 'src/app/theme/shared/components/apexchart/bajaj-chart/bajaj-chart.component';
import { BarChartComponent } from 'src/app/theme/shared/components/apexchart/bar-chart/bar-chart.component';
import { ChartDataMonthComponent } from 'src/app/theme/shared/components/apexchart/chart-data-month/chart-data-month.component';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-default',
  imports: [CommonModule, BajajChartComponent, BarChartComponent, ChartDataMonthComponent, SharedModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  dashboardCards: Array<{ label: string; value: string; icon: string; bgClass: string; roundClass: string; trendIcon: string }> = [];
  performanceHighlights: Array<{ title: string; detail: string; value: string }> = [];
  upcomingEvents: Array<{ date: string; title: string; description: string }> = [];
  recentAbsences: Array<{ className: string; details: string; badge: string; badgeClass: string; icon: string; iconClass: string; tag: string }> = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.dashboardCards = [
          { label: 'Total Students', value: data.totalStudents.toLocaleString(), icon: 'ti ti-school', bgClass: 'bg-secondary-dark', roundClass: 'secondary-round', trendIcon: 'ti ti-arrow-up-right' },
          { label: 'Active Teachers', value: data.totalTeachers.toLocaleString(), icon: 'ti ti-user-check', bgClass: 'bg-primary-dark', roundClass: 'primary-round', trendIcon: 'ti ti-arrow-up-right' },
          { label: 'Classes', value: data.totalClasses.toLocaleString(), icon: 'ti ti-layout-grid', bgClass: 'bg-secondary-dark', roundClass: 'secondary-round', trendIcon: 'ti ti-arrow-up-right' },
          { label: 'New Admissions', value: data.totalStudents.toLocaleString(), icon: 'ti ti-user-plus', bgClass: 'bg-secondary-dark', roundClass: 'secondary-round', trendIcon: 'ti ti-arrow-up-right' },
          { label: 'Registered Parents', value: data.totalParents.toLocaleString(), icon: 'ti ti-heart', bgClass: 'bg-primary-dark', roundClass: 'primary-round', trendIcon: 'ti ti-arrow-up-right' }
        ];
        this.performanceHighlights = data.performanceHighlights;
        this.upcomingEvents = data.upcomingEvents;
        this.recentAbsences = data.recentAbsences;
      }
    });
  }
}
