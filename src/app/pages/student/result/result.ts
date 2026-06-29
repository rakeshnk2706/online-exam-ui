import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';

import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, Navbar, Sidebar],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private cdr = inject(ChangeDetectorRef);

  attemptId!: number;

  loading = true;

  result: any;

  ngOnInit(): void {
    this.attemptId = Number(this.route.snapshot.paramMap.get('attemptId'));

    this.loadResult();
  }

  loadResult() {
    this.loading = true;

    this.studentService.getResult(this.attemptId).subscribe({
      next: (data) => {
        this.result = data;

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

  goDashboard() {
    this.router.navigate(['/student/dashboard']);
  }

  goExams() {
    this.router.navigate(['/student/exams']);
  }

  reviewAnswers(){
    this.router.navigate(['/student/review', this.attemptId]);
  }
}
