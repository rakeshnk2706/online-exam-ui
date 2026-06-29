import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, Navbar, Sidebar],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results implements OnInit {
  private route = inject(ActivatedRoute);
  private teacherService = inject(TeacherService);
  private cdr = inject(ChangeDetectorRef);

  examId!: number;

  loading = true;

  results: any[] = [];
  exam: any;

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    const examState = history.state.exam;

    if (examState) {
      this.exam = typeof examState === 'string' ? JSON.parse(examState) : examState;
    }

    this.loadResults();
  }

  loadResults() {
    this.loading = true;

    this.teacherService.getExamResults(this.examId).subscribe({
      next: (data) => {
        this.results = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.results = [];
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  exportExcel() {
    this.teacherService.exportResults(this.examId).subscribe({
      next: (blob) => {
        const file = new Blob([blob], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(file);

        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `Exam_${this.exam.examName}_${this.exam.className}_Results.xlsx`;
        anchor.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to export results');
      },
    });
  }

  resetStudentExam(studentId: number) {
    if (!confirm('Reset this student exam attempt?')) {
      return;
    }

    this.teacherService.resetStudentExam(this.examId, studentId).subscribe({
      next: () => {
        alert('Student exam reset successfully');
        this.loadResults();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error || 'Failed to reset exam');
        this.cdr.detectChanges();
      },
    });
  }
}
