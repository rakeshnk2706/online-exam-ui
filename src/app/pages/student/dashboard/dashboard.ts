import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterModule, Navbar, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
