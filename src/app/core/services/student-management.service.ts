import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {

  private http = inject(HttpClient);
  private api = environment.apiUrl + '/api/teacher/students';

  uploadStudents(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.api}/upload`,
      formData
    );
  }

  getStudents() {
    return this.http.get<any[]>(this.api);
  }
}