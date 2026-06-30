import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private http = inject(HttpClient);

  private api = environment.apiUrl + '/api/teacher';

  getDashboard() {
    return this.http.get<any>(`${this.api}/dashboard`);
  }

  getExamResults(examId: number) {
    return this.http.get<any[]>(`${this.api}/results/exam/${examId}`);
  }

  getStudentHistory(studentId: number) {
    return this.http.get<any[]>(`${this.api}/results/student/${studentId}`);
  }

  getExamAnalytics(examId: number) {
    return this.http.get<any>(`${this.api}/exam/${examId}/analytics`);
  }

  exportResults(examId: number) {
    return this.http.get(`${this.api}/results/export/${examId}`, {
      responseType: 'blob',
    });
  }

  resetStudentExam(examId: number, studentId: number) {
    return this.http.put(
      `${this.api}/exam/${examId}/student/${studentId}/reset`,
      {},
      {
        responseType: 'text',
      },
    );
  }

   getResult(attemptId: number) {
    return this.http.get<any>(`${this.api}/result/${attemptId}`);
  }

  getReview(attemptId: number) {
    return this.http.get<any[]>(`${this.api}/review/${attemptId}`);
  }
}
