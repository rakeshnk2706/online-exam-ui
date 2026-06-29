import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, Navbar, Sidebar],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics implements OnInit {
  private route = inject(ActivatedRoute);
  private teacherService = inject(TeacherService);
  private cdr = inject(ChangeDetectorRef);

  examId!: number;

  loading = true;

  analytics: any;

  passPercentage = 0;
  failPercentage = 0;

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;

    this.teacherService.getExamAnalytics(this.examId).subscribe({
      next: (data) => {
        this.analytics = data;

        const total = data.totalAttempts || 0;

        this.passPercentage = total > 0 ? Math.round((data.passCount * 100) / total) : 0;

        this.failPercentage = total > 0 ? Math.round((data.failCount * 100) / total) : 0;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
