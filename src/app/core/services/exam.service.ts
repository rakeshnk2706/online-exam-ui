import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private http = inject(HttpClient);

  private api = environment.apiUrl + '/api/teacher';

  createExam(data: any): Observable<any> {
    return this.http.post(`${this.api}/exams`, data);
  }

  getAllExams(): Observable<any> {
    return this.http.get(`${this.api}/exams`);
  }

  uploadQuestions(examId: number, file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<any>(`${this.api}/exams/${examId}/questions/upload`, formData);
  }

  getExamById(examId: number) {
    return this.http.get<any>(`${this.api}/exams/${examId}`);
  }

  updateExam(examId: number, exam: any) {
    return this.http.put<any>(`${this.api}/exams/${examId}`, exam);
  }

  updateExamStatus(examId: number, status: string) {
    return this.http.put<any>(`${this.api}/exams/${examId}/status?status=${status}`, {});
  }

  deleteExam(examId: number) {
    return this.http.delete(`${this.api}/exams/${examId}`, { responseType: 'text' });
  }
}
