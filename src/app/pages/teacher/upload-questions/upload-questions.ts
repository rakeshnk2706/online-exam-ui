import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';

import { ExamService } from '../../../core/services/exam.service';

@Component({
  selector: 'app-upload-questions',
  standalone: true,
  imports: [CommonModule, Navbar, Sidebar],
  templateUrl: './upload-questions.html',
  styleUrl: './upload-questions.scss',
})
export class UploadQuestions {
  private route = inject(ActivatedRoute);

  private examService = inject(ExamService);
  private cdr = inject(ChangeDetectorRef);

  examId!: number;
  exam: any;
  uploadMessage = '';
  uploadSuccess = false;

  selectedFile!: File;

  ngOnInit() {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
   
    const examState = history.state.exam;

    if (examState) {
      this.exam = typeof examState === 'string' ? JSON.parse(examState) : examState;
    }

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    this.uploadMessage = '';
    this.uploadSuccess = false;

    if (!this.selectedFile) {
      this.uploadMessage = 'Please select an Excel file.';
      return;
    }

    this.examService.uploadQuestions(this.examId, this.selectedFile).subscribe({
      next: (response: any) => {
        this.uploadSuccess = true;

        this.uploadMessage = response?.message || 'Questions uploaded successfully.';

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);

        this.uploadSuccess = false;

        this.uploadMessage = err?.error?.message || 'Upload failed. Please check Excel file.';
        this.cdr.detectChanges();
      },
    });
  }
}
