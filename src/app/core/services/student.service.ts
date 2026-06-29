import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private api = environment.apiUrl + '/api/student';

  getAvailableExams() {
    return this.http.get<any[]>(`${this.api}/exams`);
  }

  startExam(examId: number) {
    return this.http.post<any>(`${this.api}/start`, {
      examId,
    });
  }

  getAttempt(attemptId: number) {
    return this.http.get<any>(`${this.api}/attempt/${attemptId}`);
  }

  getQuestions(examId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/api/questions/exam/${examId}`);
  }
  saveAnswer(request: any) {
    return this.http.post(`${this.api}/answer`, request, { responseType: 'text' });
  }

  submitExam(request: any) {
    return this.http.post<any>(`${this.api}/submit`, request);
  }

  getResult(attemptId: number) {
    return this.http.get<any>(`${this.api}/result/${attemptId}`);
  }

  getReview(attemptId: number) {
    return this.http.get<any[]>(`${this.api}/review/${attemptId}`);
  }

  getAttemptQuestions(attemptId: number) {
    return this.http.get<any[]>(`${this.api}/attempt/${attemptId}/questions`);
  }
}
