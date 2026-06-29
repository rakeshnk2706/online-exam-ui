import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { Navbar } from '../../../shared/navbar/navbar';

import { Sidebar } from '../../../shared/sidebar/sidebar';

import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, Navbar, Sidebar],
  templateUrl: './review.html',
  styleUrl: './review.scss',
})
export class Review implements OnInit {
  private route = inject(ActivatedRoute);

  private studentService = inject(StudentService);

  private cdr = inject(ChangeDetectorRef);

  attemptId!: number;

  loading = true;

  review: any[] = [];

  ngOnInit(): void {
    this.attemptId = Number(this.route.snapshot.paramMap.get('attemptId'));

    this.loadReview();
  }

  loadReview() {
    this.studentService.getReview(this.attemptId).subscribe({
      next: (data: any) => {
        this.review = data;

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
