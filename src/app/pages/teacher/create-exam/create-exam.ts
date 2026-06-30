import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';

import { ExamService } from '../../../core/services/exam.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

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
  private dialog = inject(ConfirmDialogService);
  validationMessage = '';

  fieldErrors = {
    examName: '',
    className: '',
    durationMinutes: '',
    totalMarks: '',
    questionCount: '',
  };

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
    if (!this.validateRequiredFields()) {
      return;
    }

    if (this.validationMessage) {
      return;
    }

    this.examService.createExam(this.exam).subscribe({
      next: () => {
        this.dialog.info('Exam Created Successfully');

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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.dialog.error('Failed to Create Exam');
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

  validateRequiredFields(): boolean {
    let valid = true;

    this.fieldErrors = {
      examName: '',
      className: '',
      durationMinutes: '',
      totalMarks: '',
      questionCount: '',
    };

    if (!this.exam.examName?.trim()) {
      this.fieldErrors.examName = 'Exam Name is required.';
      valid = false;
    }

    if (!this.exam.className?.trim()) {
      this.fieldErrors.className = 'Class is required.';
      valid = false;
    }

    if (!this.exam.durationMinutes || this.exam.durationMinutes <= 0) {
      this.fieldErrors.durationMinutes = 'Duration is required.';
      valid = false;
    }

    if (!this.exam.totalMarks || this.exam.totalMarks <= 0) {
      this.fieldErrors.totalMarks = 'Total Marks is required.';
      valid = false;
    }

    if (!this.exam.questionCount || this.exam.questionCount <= 0) {
      this.fieldErrors.questionCount = 'Question Count is required.';
      valid = false;
    }

    return valid;
  }
}
