import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  visible: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeMenu();
  }

  private initializeMenu(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard']
      },
      {
        label: 'Batches',
        icon: 'pi pi-folder',
        items: [
          {
            label: 'All Batches',
            icon: 'pi pi-list',
            routerLink: ['/batches']
          },
          {
            label: 'Create New Batch',
            icon: 'pi pi-plus',
            routerLink: ['/batches/create']
          }
        ]
      },
      {
        label: 'Documents',
        icon: 'pi pi-file',
        items: [
          {
            label: 'All Documents',
            icon: 'pi pi-list',
            routerLink: ['/documents']
          },
          {
            label: 'Search Documents',
            icon: 'pi pi-search',
            routerLink: ['/documents/search']
          }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        routerLink: ['/reports']
      }
    ];
  }

  toggleSidebar(): void {
    this.visible = !this.visible;
  }
}