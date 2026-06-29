import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

import { Login } from './pages/login/login';
import { Dashboard as TeacherDashboard } from './pages/teacher/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'teacher/dashboard',
    component: TeacherDashboard,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
  },

  {
    path: 'student/dashboard',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'STUDENT'],
    },
    loadComponent: () => import('./pages/student/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'teacher/create-exam',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
    loadComponent: () =>
      import('./pages/teacher/create-exam/create-exam').then((m) => m.CreateExam),
  },

  // {
  //   path: 'teacher/results',
  //   loadComponent: () => import('./pages/teacher/results/results').then((m) => m.Results),
  // },

  // {
  //   path: 'teacher/analytics',
  //   loadComponent: () => import('./pages/teacher/analytics/analytics').then((m) => m.Analytics),
  // },
  {
    path: 'teacher/create-exam',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
    loadComponent: () =>
      import('./pages/teacher/create-exam/create-exam').then((m) => m.CreateExam),
  },
  {
    path: 'teacher/exams',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
    loadComponent: () => import('./pages/teacher/exams/exams').then((m) => m.Exams),
  },
  {
    path: 'teacher/upload-questions/:examId',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
    loadComponent: () =>
      import('./pages/teacher/upload-questions/upload-questions').then((m) => m.UploadQuestions),
  },
  {
    path: 'student/dashboard',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'STUDENT'],
    },
    loadComponent: () => import('./pages/student/dashboard/dashboard').then((m) => m.Dashboard),
  },

  {
    path: 'student/exams',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'STUDENT'],
    },
    loadComponent: () => import('./pages/student/exams/exams').then((m) => m.Exams),
  },
  {
    path: 'student/take-exam/:attemptId',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'STUDENT'],
    },
    loadComponent: () => import('./pages/student/take-exam/take-exam').then((m) => m.TakeExam),
  },
  {
    path: 'unauthorized',

    loadComponent: () => import('./pages/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },
  {
    path: 'student/result/:attemptId',
    canActivate: [roleGuard],
    data: {
      roles: ['STUDENT'],
    },
    loadComponent: () => import('./pages/student/result/result').then((m) => m.Result),
  },
  {
    path: 'student/review/:attemptId',
    canActivate: [roleGuard],
    data: {
      roles: ['STUDENT'],
    },
    loadComponent: () => import('./pages/student/review/review').then((m) => m.Review),
  },
  {
    path: 'teacher/results/:examId',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
    loadComponent: () => import('./pages/teacher/results/results').then((m) => m.Results),
  },
  {
    path: 'teacher/analytics/:examId',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
    loadComponent: () => import('./pages/teacher/analytics/analytics').then((m) => m.Analytics),
  },
  {
    path: 'teacher/edit-exam/:examId',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
    loadComponent: () => import('./pages/teacher/edit-exam/edit-exam').then((m) => m.EditExam),
  },
  {
    path: 'teacher/students',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMIN', 'TEACHER'],
    },
    loadComponent: () => import('./pages/teacher/students/students').then((m) => m.Students),
  },
];
