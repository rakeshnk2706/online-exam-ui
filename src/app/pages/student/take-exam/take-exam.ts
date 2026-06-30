import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { StudentService } from '../../../core/services/student.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-exam.html',
  styleUrl: './take-exam.scss',
})
export class TakeExam implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(ConfirmDialogService);

  attemptId!: number;
  examId!: number;

  loading = true;
  errorMessage = '';

  questions: any[] = [];
  currentIndex = 0;

  durationMinutes = 30;

  examName = '';

  totalMarks = 0;

  timeLeft = 0;
  timerDisplay = '00:00';
  timerInterval: any;

  selectedAnswers: { [questionId: number]: string } = {};

  ngOnInit(): void {
    this.attemptId = Number(this.route.snapshot.paramMap.get('attemptId'));

    const state = history.state;

    this.examId = state.examId;
    this.examName = state.examName;
    this.durationMinutes = state.durationMinutes;
    this.totalMarks = state.totalMarks;

    this.timeLeft = this.durationMinutes * 60;

    this.startTimer();

    this.loadAttemptQuestions();
  }
  loadAttempt() {
    this.loading = true;

    this.studentService.getAttempt(this.attemptId).subscribe({
      next: (attempt) => {
        this.examId = attempt.examId;
        this.timeLeft = attempt.durationMinutes ? attempt.durationMinutes * 60 : 30 * 60;

        this.startTimer();
        this.loadAttemptQuestions();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Unable to load exam attempt';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadAttemptQuestions() {
    this.loading = true;

    this.studentService.getAttemptQuestions(this.attemptId).subscribe({
      next: (data) => {
        this.questions = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Unable to load questions.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  selectOption(option: string) {
    const questionId = this.currentQuestion.id;
    this.selectedAnswers[questionId] = option;
  }

  saveAnswer() {
    const question = this.currentQuestion;

    const selectedOption = this.selectedAnswers[question.id];

    if (!selectedOption) {
      this.dialog.info('Please select an option');
      return;
    }

    const request = {
      attemptId: this.attemptId,
      questionId: question.id,
      selectedOption: selectedOption,
    };

    this.studentService.saveAnswer(request).subscribe({
      next: () => {
        this.dialog.info('Answer Saved');
      },
      error: (err) => {
        console.error(err);
        this.dialog.info('Failed to save answer');
      },
    });
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  submitExam() {
    this.dialog
      .confirm('Submit Exam', 'Are you sure you want to submit the exam?', 'Submit', 'Cancel')
      .subscribe((ok) => {
        if (ok) {
          this.submitExamConfirmed();
        }
      });
  }

  submitExamConfirmed() {
  
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const answers = this.questions.map((question) => ({
      questionId: question.id,
      selectedOption: this.selectedAnswers[question.id] || null,
    }));

    const request = {
      attemptId: this.attemptId,
      answers: answers,
    };

    this.studentService.submitExam(request).subscribe({
      next: () => {
        this.router.navigate(['/student/result', this.attemptId]);
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.dialog.info('Failed to submit exam');
      },
    });
  }

  startTimer() {
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      this.timeLeft--;

      this.updateTimerDisplay();
      this.cdr.detectChanges();

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);

        this.dialog.info('Time is over. Exam will be submitted automatically.');

        this.submitExam();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);

    const seconds = this.timeLeft % 60;

    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
