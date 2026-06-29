import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { StudentManagementService } from '../../../core/services/student-management.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './students.html',
  styleUrl: './students.scss',
})
export class Students implements OnInit {
  private service = inject(StudentManagementService);
  private cdr = inject(ChangeDetectorRef);

  students: any[] = [];
  loading = true;

  selectedFile!: File;

  message = '';
  success = false;

  showPasswordMap: { [id: number]: boolean } = {};

  filteredStudents: any[] = [];

  rollNoFilter = '';
  studentNameFilter = '';
  usernameFilter = '';
  classFilter = '';
  sectionFilter = '';

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;

    this.service.getStudents().subscribe({
      next: (data) => {
        this.students = Array.isArray(data) ? data : [];
        this.filteredStudents = [...this.students];
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.message = '';
  }

  uploadStudents() {
    this.message = '';
    this.success = false;

    if (!this.selectedFile) {
      this.message = 'Please select an Excel file.';
      return;
    }

    this.service.uploadStudents(this.selectedFile).subscribe({
      next: (res) => {
        this.success = true;
        this.message = res?.message || 'Students uploaded successfully.';
        this.loadStudents();
      },
      error: (err) => {
        console.error(err);
        this.success = false;
        this.message = err?.error?.message || 'Upload failed. Please check the Excel file.';
      },
    });
  }

  togglePassword(studentId: number) {
    this.showPasswordMap[studentId] = !this.showPasswordMap[studentId];
  }

  filterStudents() {
    this.filteredStudents = this.students.filter(
      (student) =>
        (student.rollNo ?? '').toLowerCase().includes(this.rollNoFilter.toLowerCase()) &&
        (student.studentName ?? '').toLowerCase().includes(this.studentNameFilter.toLowerCase()) &&
        (student.username ?? '').toLowerCase().includes(this.usernameFilter.toLowerCase()) &&
        (student.className ?? '').toLowerCase().includes(this.classFilter.toLowerCase()) &&
        (student.section ?? '').toLowerCase().includes(this.sectionFilter.toLowerCase()),
    );
  }
}
