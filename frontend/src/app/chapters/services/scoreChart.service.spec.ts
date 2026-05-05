jest.mock('chart.js', () => {

  const ChartMock: any = jest.fn().mockImplementation(() => ({
    update: jest.fn(),
    destroy: jest.fn(),
    data: {}
  }));

  ChartMock.register = jest.fn();

  return {
    Chart: ChartMock,
    ArcElement: {},
    Tooltip: {},
    Legend: {},
    DoughnutController: {}
  };
});

import { ScoreChartService } from './scoreChart.service';
import { Chart } from 'chart.js';

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