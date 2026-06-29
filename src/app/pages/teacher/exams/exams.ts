import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';

import { ExamService } from '../../../core/services/exam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, Navbar, Sidebar],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams implements OnInit {
  private router = inject(Router);
  private examService = inject(ExamService);
  private cdr = inject(ChangeDetectorRef);

  exams: any[] = [];

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams() {
    this.examService.getAllExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      },
    });
  }

  uploadQuestions(exam: any) {
    this.router.navigate(['/teacher/upload-questions', exam.id], {
      state: { exam: JSON.stringify(exam) },
    });
  }

  viewResults(exam: any) {
    this.router.navigate(['/teacher/results', exam.id], {
      state: { exam: JSON.stringify(exam) },
    });
  }

  viewAnalytics(exam: any) {
    this.router.navigate(['/teacher/analytics', exam.id], {
      state: { exam: JSON.stringify(exam) },
    });
  }

  editExam(examId: number) {
    this.router.navigate(['/teacher/edit-exam', examId]);
  }

  toggleStatus(exam: any) {
    const newStatus = exam.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    this.examService.updateExamStatus(exam.id, newStatus).subscribe({
      next: () => {
        exam.status = newStatus;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update exam status');
        this.cdr.detectChanges();
      },
    });
  }

  deleteExam(examId: number) {
    if (!confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    this.examService.deleteExam(examId).subscribe({
      next: () => {
        alert('Exam deleted successfully');
        this.cdr.detectChanges();
        this.loadExams();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete exam');
        this.cdr.detectChanges();
      },
    });
  }
}
