import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';

import { ExamService } from '../../../core/services/exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [FormsModule, CommonModule, Navbar, Sidebar],
  templateUrl: './create-exam.html',
  styleUrl: './create-exam.scss',
})
export class CreateExam {
  private examService = inject(ExamService);
  private cdr = inject(ChangeDetectorRef);
  validationMessage = '';

  exam = {
    examName: '',
    description: '',
    durationMinutes: 60,
    totalMarks: 100,
    questionCount: 10,
    status: 'ACTIVE',
    className: '',
  };

  createExam() {
    this.validateExam();

    if (this.validationMessage) {
      return;
    }

    this.examService.createExam(this.exam).subscribe({
      next: () => {
        alert('Exam Created Successfully');

        this.exam = {
          examName: '',
          description: '',
          durationMinutes: 60,
          totalMarks: 100,
          questionCount: 10,
          status: 'ACTIVE',
          className: '',
        };

        this.validationMessage = '';
      },
      error: (err) => {
        console.error(err);
        alert('Failed to Create Exam');
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
}
