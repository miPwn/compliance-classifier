import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeMenu();
  }

  private initializeMenu(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/dashboard'])
      },
      {
        label: 'Batches',
        icon: 'pi pi-folder',
        command: () => this.router.navigate(['/batches'])
      },
      {
        label: 'Documents',
        icon: 'pi pi-file',
        command: () => this.router.navigate(['/documents'])
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        command: () => this.router.navigate(['/reports'])
      }
    ];
  }

  logout(): void {
    // TODO: Implement logout functionality
    this.router.navigate(['/login']);
  }
}