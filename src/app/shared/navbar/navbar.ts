import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  private router = inject(Router);

  username =
    localStorage.getItem('username');

  logout() {

    localStorage.clear();
    sessionStorage.clear();

    this.router.navigate(['/login']);
  }
}