import { Injectable } from '@angular/core';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

@Injectable({
    providedIn: 'root'
})
export class ScoreChartService {

  private chart?: Chart;
  private initialized = false;

  private initChartJS(): void {
    if (this.initialized) {
        return;
    }

    Chart.register(ArcElement, Tooltip, Legend, DoughnutController);
    this.initialized = true;
  }

  render(
        canvas: HTMLCanvasElement,
        correct: number,
        total: number
  ): void {
    this.initChartJS();
    const incorrect = Math.max(total - correct, 0);
    const data = {
        labels: ['Correct', 'Incorrect'],
        datasets: [
            {
            data: [correct, incorrect],
            backgroundColor: ['#4caf50', '#f44336']
            }
        ]
    };

    if (this.chart) {
        this.chart.data = data;
        this.chart.update();
        return;
    }

    this.chart = new Chart(canvas, {
        type: 'doughnut',
        data,
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                enabled: true
            }
            }
        }
    });
  }

  destroy(): void {
    if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
    }
  }
}