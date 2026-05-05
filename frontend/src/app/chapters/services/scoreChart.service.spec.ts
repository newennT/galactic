import { ScoreChartService } from './scoreChart.service';
import { Chart } from 'chart.js';

jest.mock('chart.js', () => ({
  Chart: jest.fn().mockImplementation(() => ({
    update: jest.fn(),
    destroy: jest.fn(),
    data: {}
  }))
}));

describe('ScoreChartService', () => {
  let service: ScoreChartService;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    service = new ScoreChartService();
    canvas = document.createElement('canvas');
  });

  it('should create chart on first render', () => {
    service.render(canvas, 3, 5);
    expect(Chart).toHaveBeenCalled();
  });

  it('should update chart on second render', () => {
    service.render(canvas, 3, 5);
    service.render(canvas, 4, 5);
    const instance = (service as any).chart;
    expect(instance.update).toHaveBeenCalled();
  });

  it('should destroy chart', () => {
    service.render(canvas, 3, 5);
    const instance = (service as any).chart;
    service.destroy();
    expect(instance.destroy).toHaveBeenCalled();
  });
});