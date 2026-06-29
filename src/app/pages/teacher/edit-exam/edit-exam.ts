import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { ExamService } from '../../../core/services/exam.service';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './edit-exam.html',
  styleUrl: './edit-exam.scss',
})
export class EditExam implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);
  private cdr = inject(ChangeDetectorRef);

  examId!: number;

  loading = true;

  validationMessage = '';

  exam: any = {
    examName: '',
    description: '',
    durationMinutes: 60,
    totalMarks: 100,
    questionCount: 10,
    className: '',
    status: 'ACTIVE',
  };

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));

    this.loadExam();
  }

  loadExam() {
    this.loading = true;

    this.examService.getExamById(this.examId).subscribe({
      next: (data) => {
        this.exam = data;
        this.loading = false;
        this.validateExam();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  validateExam() {
    this.validationMessage = '';

    if (!this.exam.totalMarks || !this.exam.questionCount) {
      return;
    }

    if (this.exam.questionCount <= 0) {
      this.validationMessage = 'Question Count should be greater than zero.';
      return;
    }

    if (this.exam.totalMarks % this.exam.questionCount !== 0) {
      this.validationMessage = 'Total Marks should be exactly divisible by Question Count.';
      return;
    }
  }

  updateExam() {
    this.validateExam();

    if (this.validationMessage) {
      return;
    }

    this.examService.updateExam(this.examId, this.exam).subscribe({
      next: () => {
        alert('Exam updated successfully');

        this.router.navigate(['/teacher/exams']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update exam');
      },
    });
  }

  cancel() {
    this.router.navigate(['/teacher/exams']);
  }
}
