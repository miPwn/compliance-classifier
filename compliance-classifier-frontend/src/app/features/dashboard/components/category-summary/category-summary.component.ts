import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { BadgeModule } from 'primeng/badge';

// Models
import { ClassificationCategory, CategoryDistribution } from '../../../../core/services/classification.service';

// Extended interface for our component
interface CategoryWithCount extends ClassificationCategory {
  documentCount?: number;
  riskLevel?: string;
}

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ProgressBarModule,
    ChartModule,
    BadgeModule
  ]
})
export class CategorySummaryComponent implements OnInit, OnChanges {
  @Input() categories: CategoryWithCount[] = [];
  @Input() isLoading: boolean = false;
  
  pieChartData: any;
  pieChartOptions: any;
  barChartData: any;
  barChartOptions: any;
  
  ngOnInit(): void {
    this.initCharts();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories']) {
      this.initCharts();
    }
  }
  
  /**
   * Initialize chart data and options based on categories
   */
  initCharts(): void {
    if (this.categories.length === 0) return;
    
    // Prepare data for pie chart
    const labels = this.categories.map(c => c.name);
    const data = this.categories.map(c => c.documentCount || 0);
    const backgroundColors = [
      '#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2',
      '#EC407A', '#AB47BC', '#5C6BC0', '#29B6F6', '#26A69A'
    ];
    
    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors.slice(0, data.length)
        }
      ]
    };
    
    this.pieChartOptions = {
      plugins: {
        legend: {
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
    
    // Prepare data for bar chart
    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Document Count',
          data: data,
          backgroundColor: '#42A5F5'
        }
      ]
    };
    
    this.barChartOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }
}