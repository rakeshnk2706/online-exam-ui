import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';

import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [CommonModule, Navbar, Sidebar],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
})
export class Exams implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  exams: any[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    console.log('Component Loaded');
    this.loadExams();
  }

  loadExams() {
    console.log('Before API Call');

    this.loading = true;

    this.studentService.getAvailableExams().subscribe({
      next: (data: any) => {
        console.log('Success');
        console.log('API Data:', data);
        console.log('Is Array:', Array.isArray(data));

        // If API directly returns array
        if (Array.isArray(data)) {
          this.exams = data;
        }
        // If API returns wrapped response
        else if (Array.isArray(data?.data)) {
          this.exams = data.data;
        } else if (Array.isArray(data?.exams)) {
          this.exams = data.exams;
        } else {
          this.exams = [];
        }

        this.loading = false;

        console.log('Exams:', this.exams);
        console.log('Exams Length:', this.exams.length);
        console.log('Loading:', this.loading);

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.log('Error');
        console.error(err);

        this.exams = [];
        this.loading = false;

        console.log('Loading:', this.loading);

        this.cdr.detectChanges();
      },
    });
  }

  startExam(exam: any) {
    this.studentService.startExam(exam.id).subscribe({
      next: (response) => {
        this.router.navigate(['/student/take-exam', response.attemptId], {
          state: response,
        });
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}